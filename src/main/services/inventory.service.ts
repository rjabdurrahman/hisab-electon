import { AppDataSource } from "../database/data-source";
import { Category } from "../database/entities/Category";
import { Product } from "../database/entities/Product";

export class InventoryService {
  /**
   * Fetches all categories.
   */
  static async getAllCategories() {
    const categoryRepository = AppDataSource.getRepository(Category);
    const categories = await categoryRepository.find();
    return JSON.parse(JSON.stringify(categories));
  }

  /**
   * Creates a new category.
   * @param name Category name.
   * @param description Category description.
   */
  static async createCategory(name: string, description: string) {
    const categoryRepository = AppDataSource.getRepository(Category);
    const category = new Category();
    category.name = name;
    category.description = description;
    const savedCategory = await categoryRepository.save(category);
    return JSON.parse(JSON.stringify(savedCategory));
  }

  /**
   * Fetches a category with its associated products.
   * @param categoryId The ID of the category.
   */
  static async getCategoryWithProducts(categoryId: number) {
    const categoryRepository = AppDataSource.getRepository(Category);
    const category = await categoryRepository.findOne({
      where: { id: categoryId },
      relations: { products: true },
    });

    if (!category) {
      return null;
    }

    return JSON.parse(JSON.stringify(category));
  }

  /**
   * Adds a new product to a category.
   * @param categoryId The ID of the category.
   * @param productData Data for the new product.
   */
  static async addProduct(categoryId: number, productData: { name: string; price: number; stock: number }) {
    const categoryRepository = AppDataSource.getRepository(Category);
    const productRepository = AppDataSource.getRepository(Product);

    const category = await categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new Error("Category not found");
    }

    const product = new Product();
    product.name = productData.name;
    product.price = productData.price;
    product.stock = productData.stock;
    product.category = category;

    const savedProduct = await productRepository.save(product);
    return JSON.parse(JSON.stringify(savedProduct));
  }
}
