import { Pipe, PipeTransform } from '@angular/core';
import {IProductCategorie, IProductGroup, IProductItem} from "../../models/items/products/products";
import {ProductsToGroupsPipe} from "./product_to_grouppipe.pipe";

@Pipe({
  name: 'products_to_categories',
  standalone: true,
})
export class ProductsToCategoriesPipe implements PipeTransform {

  transform(products: IProductItem[]): IProductCategorie[] {
      // Predefine result ( should be immutably refactored later on with .map(), but that was tricky on objects
      let result: IProductCategorie[] = []

      // This is typescript wizardy
      // From this website https://sylhare.github.io/2022/03/08/Reduce-in-typescript.html
      const productsPerCategorie: [] = products.reduce((result: any, product): IProductGroup[] => (
          {...result,
              [product.product_meta.categorie]: [...(result[product.product_meta.categorie] || []), product]
          }
      ), {})

      // Converting {categorieName: products[]} to full categorie interface
      const product_to_group = new ProductsToGroupsPipe()
      for (const categorieName in productsPerCategorie) {
          const productGroups = product_to_group.transform(productsPerCategorie[categorieName])
          const productCategorie: IProductCategorie = {
              categorie_name: categorieName,
              product_groups: productGroups
          }
          result.push(productCategorie)
      }

      return result
  }

}
