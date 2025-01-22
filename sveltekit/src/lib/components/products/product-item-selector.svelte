<script lang="ts">
  import type {ProductOutI} from "$lib/models/productsI";

  let { product }: { product: ProductOutI } = $props();
  let count = $state(0);

  let name = $derived.by(() => {
    if (product.price_policy === null || product.price_policy.name === null) return product.name;
    return product.price_policy.name;
  })

  function increaseCount() {

  }
  function decreaseCount() {

  }
</script>

<div>
  <h5>{ name }</h5>

  {#if product.max_count > 0}
    {#if product.price_policy.price > 0}
      <p class="whitespace-nowrap text-black">&euro; { product.price_policy.price }</p>
    {/if}

    <button disabled={ count <= product.max_count }>
      <span class="sr-only">Product 1x verwijderen</span>
      <span>-</span>
    </button>

    <form>
      <input id="product-count-form" type="number" value="0">
    </form>

    <button disabled={ count >= product.max_count }>
      <span class="sr-only">Product 1x toevoegen</span>
      <span>+</span>
    </button>
  {:else}

  {/if}
</div>

<style>
    div {
        margin: 0;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;

        border-radius: 8px;
        min-height: 2rem;
        padding-left: 0.3rem;
        padding-right: 0.3rem;
    }

    h5 {
        margin: 0;
        padding: 0;
        flex-grow: 1;

        text-align: left;
    }
    p {
        margin: 0;
        padding-right: 0.5rem;
        text-wrap: none;
    }

    /* Button */
    button {
        display: flex;
        justify-content: center;
        align-items: center;

        box-sizing: border-box;
        -webkit-flex-shrink: 0;
        flex-shrink: 0;

        height: 1.5rem;
        width: 1.5rem;

        padding: 0;

        border: none;
        border-radius: 10px;

        font-size: 1.3rem;
        line-height: 1.3rem;

        color: var(--mainwhite);
    }

    /* Input */
    input {
        margin-left: 0.3rem;
        margin-right: 0.3rem;

        height: 1.5rem;
        min-width: 4rem;

        padding: 0;

        border: none;
        text-align: center;
        font-size: 1rem;
        line-height: 1rem;

        -webkit-text-decoration-thickness: 2px;
        -webkit-text-decoration-line: underline;
        -webkit-text-decoration-style: solid;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    #product-count-form {
        width: 1.5rem;
    }

    .product-to-login {
        width: auto;
        font-size: inherit;

        padding: 3px;
        padding-left: 6px;
        padding-right: 6px;

        border: none;
        border-radius: 10px;
    }

</style>