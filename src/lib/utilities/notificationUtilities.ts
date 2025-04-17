import { AppStorage } from '$lib/scanners/storage.ts';
import { PUBLIC_API_URL } from '$env/static/public';
import { notification_token } from '../../hooks.client.ts';

export function get_all_possible_notifications() {
	AppStorage.getWide("notifications_general")?.then(async (result) => {
		if (result === undefined || result === null || result === "false") {
			const fetchData = await queryNotification()
			AppStorage.getWide("notifications")?.then(async (stored_notification_options) => {
				if (stored_notification_options !== undefined && stored_notification_options !== null) {
					stored_notification_options = JSON.parse(stored_notification_options);
					let stored_option: keyof typeof stored_notification_options;
					for (const item of fetchData) {
						let is_in_storage = false
						for (stored_option in stored_notification_options) {
							if ("" + item.item.id === stored_option) {
								is_in_storage = true
								break
							}
						}
						if (!is_in_storage && item.derived_type.derived_type_enum === "notificationitem" && item.derived_type.default_subscription) {
							await subscribe_to_topic("" + item.item.id)
						}
					}
				} else {
					for (const item of fetchData) {
						if (item.derived_type.derived_type_enum === "notificationitem" && item.derived_type.default_subscription) {
							await subscribe_to_topic("" + item.item.id)
						}
					}
				}
			});
		}
	})
}

export function subscribe_to_topic(item: string | number) {
	const payload = {
		token: notification_token
	}
	return fetch(`${PUBLIC_API_URL}/item/notification/subscribe/${item}`, {
		method: "POST",
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(payload)
	}).then(r => r.json())
}

export function unsubscribe_from_topic(item: string | number) {
	const payload = {
		token: notification_token
	}
	return fetch(`${PUBLIC_API_URL}/item/notification/unsubscribe/${item}`, {
		method: "POST",
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(payload)
	}).then(r => r.json())
}

export function queryNotification(limit: number = 10, offset: number = 0) {
	const param = {
		limit: limit,
		offset: offset
	}
	const params = new URLSearchParams(removeNull(param));
	return fetch(`${PUBLIC_API_URL}/item/notification/?${params.toString()}`).then(r => r.json())
}

function removeNull<T>(obj: T | any): T | any {
	Object.keys(obj).forEach((key) => {
		// Delete if the value is null or undefined
		if (obj[key] == null) {
			delete obj[key];
		}
		else if (obj[key] && typeof obj[key] === 'object') {
			// If the object is an empty array, delete the key
			if (Array.isArray(obj[key]) && obj[key].length === 0) {
				delete obj[key];
			} else {
				// Recursively call removeNull for nested objects
				removeNull(obj[key]);
			}
		}
	})
	return obj;
}
