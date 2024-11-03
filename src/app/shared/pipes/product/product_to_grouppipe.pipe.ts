import { Pipe, PipeTransform } from '@angular/core';
import {ProductGroupI, ProductOutI} from '../../models/product/products';

@Pipe({
  name: 'products_to_groups',
  standalone: true,
})
export class ProductsToGroupsPipe implements PipeTransform {

  transform(products: ProductOutI[]): ProductGroupI[] {
    // This is typescript wizardy
    // From this website https://sylhare.github.io/2022/03/08/Reduce-in-typescript.html
    const grouped_as_object: [] = products.reduce((result: any, product): ProductGroupI[] => (
      {...result,
        [product.product_meta.group]: [...(result[product.product_meta.group] || []), product]
      }
    ), {});

    // From the wizardy above we get a list of objects
    // Last step is transforming the objects intoa list of IProductGroup objects
    const productGroups: ProductGroupI[] = [];
    for (const product_name in grouped_as_object) {
      const group: ProductGroupI = {
        group_name: product_name !== null ? product_name: '',  // condition ? v_true: v_false
        products: grouped_as_object[product_name]
      };
      productGroups.push(group);
    }

    return productGroups;
  }

}
