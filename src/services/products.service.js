import ProductModel from "../DAO/models/product.model.js";

class ServiceProducts {
    async getAllProducts(page, limit, sort, query) {
        try {
            const filter = query
            ? { title: { $regex: query.title, $options: "i" } }
            : {};
            const products = await ProductModel.paginate(filter, {
                limit: limit || 5,
                page: page || 1,
                sort: sort === "desc" ? "-price" : "price",
                lean: true,
              });
            return products;
        } catch (error) {
            throw error;
        }
    }

    async getProductById(productId) {
        try {
            const one = await ProductModel.findById(productId);
            return one;
        } catch (error) {
            throw new Error(error);
        }
    }

    async createProduct(productData) {
        try {
            const newProd = await ProductModel.create(productData);
            return newProd;
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateProduct(productId, productData) {
        try {
            const productUpdate = await ProductModel.findByIdAndUpdate(
                productId,
                productData,
                { new: true }
            );
            return productUpdate;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(productId) {
        try {
            const delProd = await ProductModel.findByIdAndDelete(productId);
            return delProd;
        } catch (error) {
            throw new Error(error);
        }
    }
};

export default ServiceProducts;