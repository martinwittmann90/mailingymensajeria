import ProductModel from "../models/product.model.js"

class ProductsDAO {
  async getAll(filter = {}, options = {}, paginate = false) {
    try {
      let products;
      paginate
        ? (products = await ProductModel.paginate(filter, options))
        : (products = await ProductModel.find(filter, options));

      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id, checkid = false) {
    try {
      let product;
      checkid ? (product = await ProductModel.findOne({ code: id })) : (product = await ProductModel.findOne({ _id: id }));
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async add(product) {
    try {
      const newProduct = await ProductModel.create(product);
      return newProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id, product) {
    try {
      const productUpdated = await ProductModel.updateOne({ _id: id }, product);
      return productUpdated;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id) {
    try {
      const productDeleted = await ProductModel.deleteOne({ _id: id });
      return productDeleted;
    } catch (error) {
      console.log(error);
    }
  }
}
export default ProductsDAO;

