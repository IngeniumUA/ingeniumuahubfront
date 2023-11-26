import { Pipe, PipeTransform } from '@angular/core';
import {IProductGroup, IProductItem} from "../../models/items/products/products";

@Pipe({
  name: 'products_to_groups',
  standalone: true,
})
export class ProductsToGroupsPipe implements PipeTransform {

  transform(products: IProductItem[]): IProductGroup[] {
    // This is typescript wizardy
    // From this website https://sylhare.github.io/2022/03/08/Reduce-in-typescript.html
    const grouped_as_object: [] = products.reduce((result: any, product): IProductGroup[] => (
      {...result,
        [product.product_meta.group]: [...(result[product.product_meta.group] || []), product]
      }
    ), {})

    // From the wizardy above we get a list of objects
    // Last step is transforming the objects intoa list of IProductGroup objects
    let productGroups: IProductGroup[] = []
    for (const product_name in grouped_as_object) {
      const group: IProductGroup = {
        group_name: product_name !== null ? product_name: "",  // condition ? v_true: v_false
        products: grouped_as_object[product_name]
      }
      productGroups.push(group)
    }

    return productGroups
  }

}
