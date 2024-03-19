import { Pipe, PipeTransform } from '@angular/core';
import {IProductCategorie, IProductGroup, IProductItem} from '../../models/items/products/products';
import {ProductsToGroupsPipe} from './product_to_grouppipe.pipe';

@Pipe({
  name: 'products_to_categories',
  standalone: true,
})
export class ProductsToCategoriesPipe implements PipeTransform {

  transform(products: IProductItem[]): IProductCategorie[] {
    // Predefine result ( should be immutably refactored later on with .map(), but that was tricky on objects
    const result: IProductCategorie[] = [];

    // Sorting in Descending Order ( reversed )
    // We sort the products beforehand and then construct the Groups and Categories later on
    // As the order is preserved by reducing the products ( see Data Structures and Algorithms course )
    const sortedProducts = products.sort(
      (lhs, rhs) => rhs.product_ordering - lhs.product_ordering);

    console.log(sortedProducts);

    // This is typescript wizardy
    // From this website https://sylhare.github.io/2022/03/08/Reduce-in-typescript.html
    const productsPerCategorie: [] = sortedProducts.reduce((result: any, product): IProductGroup[] => (
      {...result,
        [product.product_meta.categorie]: [...(result[product.product_meta.categorie] || []), product]
      }
    ), {});

    // Converting {categorieName: products[]} to full categorie interface
    const product_to_group = new ProductsToGroupsPipe();
    for (const categorieName in productsPerCategorie) {
      const productGroups = product_to_group.transform(productsPerCategorie[categorieName]);
      const productCategorie: IProductCategorie = {
        categorie_name: categorieName,
        product_groups: productGroups
      };
      result.push(productCategorie);
    }

    return result;
  }

}
