<script lang="ts">
  import type { ItemWideLimitedI } from '$lib/models/item/itemwideI.ts';
  import { onMount } from 'svelte';
  import {
    queryNotification,
    subscribe_to_topic,
    unsubscribe_from_topic
  } from '$lib/utilities/notificationUtilities.ts';
  import { AppStorage } from '$lib/scanners/storage.js';
  import InlineSpinner from '$lib/components/spinners/inline-spinner.svelte';
  import { notification_token, setVibration } from '../../../hooks.client.ts';
  import { auth } from '$lib/states/auth.svelte.ts';
  import { PUBLIC_API_URL } from '$env/static/public';


  let form_data: any = {}
  let loading = false;

  let notificationList: ItemWideLimitedI[] = [];
  let loading_options = true
  let all_topic: string = ""

  let vibrationValue: boolean = true

  onMount(async () => {
    const data = await queryNotification()
    let final_data: ItemWideLimitedI[] = []
    loading_options = false
    form_data = {disable_notifications: {storedValue: false, isDisabled: false}}

    for (let notification of data) {
      if (notification.derived_type.derived_type_enum === "notificationitem" && notification.derived_type.notification_topic !== "all") {
        final_data.push(notification);
        form_data["" + notification.item.id] = {storedValue: notification.derived_type.default_subscription, isDisabled: false}
      } else {
        all_topic = "" + notification.item.id
      }
    }

    notificationList = final_data

    const result = await AppStorage.getWide("notifications_general")
    if (result !== undefined && result !== null) {
      let bool_result: boolean = result === "true"
      form_data["disable_notifications"].storedValue = bool_result
      if (bool_result) {
        for (let notification of notificationList) {
          form_data[""+notification.item.id].isDisabled = true
        }
      } else {
        for (let notification of notificationList) {
          form_data[""+notification.item.id].isDisabled = false
        }
      }
    }
    let stored_notification_options = await AppStorage.getWide("notifications")
    if (stored_notification_options !== undefined && stored_notification_options !== null) {
      stored_notification_options = JSON.parse(stored_notification_options);
      let stored_option: keyof typeof stored_notification_options;
      for (stored_option in stored_notification_options) {
        for (let fetched_option of notificationList) {
          if (stored_option === "" + fetched_option.item.id) {
            form_data[stored_option].storedValue = stored_notification_options[stored_option]
          }
        }
      }
    }

    let storedVibration = await AppStorage.getWide("vibration")
    if (storedVibration !== undefined && storedVibration !== null) {
      storedVibration = JSON.parse(storedVibration)
      setVibration(storedVibration)
      vibrationValue = storedVibration
    }
  })

  function all_notifications_clicked() {
    if (form_data["disable_notifications"].storedValue) {
      for (let notification of notificationList) {
        form_data[""+notification.item.id].isDisabled = true
      }
    } else {
      for (let notification of notificationList) {
        form_data[""+notification.item.id].isDisabled = false
      }
    }
  }

  function onSubmit() {
    if (loading) return;

    loading = true;
    let notificationDetails: any = {}
    for (let notification of notificationList) {
      if (notification.derived_type.derived_type_enum === "notificationitem" && notification.derived_type.notification_topic === "all") {
        const index = notificationList.indexOf(notification, 0);
        if (index > -1) {
          notificationList.splice(index, 1);
        }
      } else {
        notificationDetails["" + notification.item.id] = form_data[""+notification.item.id].storedValue
      }
    }
    AppStorage.setWide("notifications", JSON.stringify(notificationDetails))
    AppStorage.setWide("notifications_general", JSON.stringify(form_data["disable_notifications"].storedValue))

    let option: keyof typeof notificationDetails;
    if (form_data["disable_notifications"].storedValue) {
      unsubscribe_from_topic(all_topic)
      if (auth.user?.email !== undefined) {
        unlink_user_token(auth.user.email)
      }
      for (option in notificationDetails) {
        unsubscribe_from_topic(option)
      }
    } else {
      subscribe_to_topic(all_topic)
      if (auth.user?.email !== undefined) {
        link_user_token(auth.user.email)
      }
      for (option in notificationDetails) {
        if (notificationDetails[option]) {
          subscribe_to_topic(option)
        } else {
          unsubscribe_from_topic(option)
        }
      }
    }

    loading = false;
  }

  function unlink_user_token(email: string) {
    const payload = {
      token: null,
    }
    return fetch(`${PUBLIC_API_URL}/item/notification/link_user/${email}`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    }).then(r => r.json())
  }

  function link_user_token(email: string) {
    const payload = {
      token: notification_token,
    }
    return fetch(`${PUBLIC_API_URL}/item/notification/link_user/${email}`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    }).then(r => r.json())
  }

  function vibrationChanged() {
    AppStorage.setWide("vibration", JSON.stringify(vibrationValue))
    setVibration(vibrationValue)
  }
</script>

<section class="h-full">
  <h2 class="white-section-title">Jouw Notificatie instellingen</h2>
  <p>Wijzig hier jouw persoonlijke instellingen voor notificaties. Druk op Opslaan om je wijzigingen door te voeren.</p>

  {#if (loading_options)}
    <InlineSpinner message="We halen de mogelijke opties op..." />
  {:else }
    <div class="p-4">

      <div class=" form-field form-field-checkbox flex items-center justify-between border-b py-2">
        <input id="vibrationSettings" type="checkbox"
               onchange={()=>{vibrationChanged()}}
               bind:checked={vibrationValue}
        >
        <label for="vibrationSettings" class="flex items-center space-x-2">Trillen bij meldingen</label>
      </div>

      <div class=" form-field form-field-checkbox flex items-center justify-between border-b py-2">
        <input id="disable_notifications" type="checkbox"
               onchange={()=>{all_notifications_clicked()}}
               bind:checked={form_data["disable_notifications"].storedValue}
        >
        <label for="disable_notifications" class="flex items-center space-x-2">Schakel alle notificaties uit</label>
      </div>

      {#each notificationList as itemWide}
        <div class=" form-field form-field-checkbox flex items-center justify-between py-2">
          <input id={""+itemWide.item.id} type="checkbox"
                 bind:checked={form_data[""+itemWide.item.id].storedValue}
                 disabled={form_data[""+itemWide.item.id].isDisabled}
          >
          <label for={""+itemWide.item.id} class="flex items-center space-x-2">{ itemWide.item.name }</label>
        </div>
      {/each}

    </div>

    <div class="form-field text-right">
      <button onclick={()=>{onSubmit()}} type="submit" class="button button-danger" disabled={loading}>Opslaan</button>
    </div>
  {/if}
</section>

<style lang="scss">
  input:disabled+label{color:#ccc;}
</style>
