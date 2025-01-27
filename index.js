const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');


const Users = require('./models/users.models');
const Products = require('./models/products.models');
const Orders = require('./models/orders.models');
const Cart = require('./models/cart.models');
const cors = require('cors');

require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const app = express();

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.options('*', cors());

//Get all users
app.get('/api/users', async(req, res) => {
    try {
        const user = await Users.find();
        res.status(200).send(user)
    } catch(error) {
        console.error({
            message: "Error occured when fetching users", error
        })
    }
})

//Sign up
app.post('/api/users/signup', async(req, res) => {
    try {
        if (!req.body.name && !req.body.email && !req.body.password) {
            return res.status(400).send({
                message: "Fields cannot be empty"
            })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = await Users.create(
            {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role,
            }
        )
        await user.save().then(data => {
            res.send({
                message: "Sign up successful",
                user: data
            })
        })

    } catch(error) {
        console.error({
            message: "Error occured during sign up process", error
        })
    }
})

//Log in
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required." });
        }

        const user = await Users.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET
        );

        res.status(200).send({
            message: `Welcome back, ${user.name}!`,
            token,
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ message: "An error occurred. Please try again later." });
    }
});


//Get user by ID
app.get('/api/users/id', async(req, res) => {
    try {
        const id = req.query.id;
        const userID = Users.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            { $project: { _id: true, 
                          name: true,
                          role: true,
                          email: true,
                          createdAt: true 
                        } }
        ])
        res.status(200).send(productID);
    } catch(error) {
        console.error({
            message: "Error occured while fetching user", error
        })
    }
});

//Delete user by ID
app.delete('/api/users', async(req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            res.status(400).send({
                message: "id parameter cannot be empty"
            })
        }
        const userID = Users.deleteOne(
            { _id: new mongoose.Types.ObjectId(id) }
        )
        res.status(200).send(userID);
    } catch(error) {
        console.error({
            message: "Error occured while fetching user", error
        })
    }
});

//List all products
app.get('/api/products', async(req, res) => {
    try {
        const products = await Products.find();
        res.status(200).send(products);
    } catch(error) {
        console.error({
            message: "Error occured while fetching data"
        })
    }
})

//Add product
app.post('/api/products', async(req, res) => {
    try {
        const name = req.body.name;
        const quantity = req.body.quantity;
        const category = req.body.category;
        const price = req.body.price;
        const productDescription = req.body.productDescription;
        const image = req.body.image;

        if (!req.body.name && !req.body.quantity && !req.body.category
            && !req.body.price
        ) {
            return res.status(400).send({
                message: "Fields cannot be empty"
            })
        }
        const product = await Products.create(
            {
                name: name,
                quantity: quantity,
                category: category,
                price: price,
                productDescription: productDescription,
                image: image
            }
        )

        await product.save().then(data => {
            res.send({
                message: "Product added successfully",
                product: data
            })
        })

    } catch(error) {
        console.error({
            message: "Error occured while adding product", error
        })
    }
})

//List product by ID
app.get('/api/products/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const productID = await Products.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            { $project: { _id: true, name: true, price: true, productDescription: true, image: true } }
        ])
        res.status(200).send(productID[0]);
    } catch(error) {
        console.error({
            message: "Error occured while fetching product", error
        })
    }
})

//Delete product by ID
app.delete('/api/products/id', async(req, res) => {
    try {
        const id = req.query.id;
        const productID = Products.deleteOne(
            { _id: new mongoose.Types.ObjectId(id) }
        );

        if (productID.length === 0) {
            res.status(400).send({
                message: "Product not found"
            })
        };
        res.status(200).json(productID);
    } catch(error) {
        console.error({
            message: "Error occured while deleting product", error
        })
    }
})

// Update product by id
app.patch('/api/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send({
                message: "id parameter is required"
            });
        }


        const updatedProduct = await Products.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                quantity: req.body.quantity,
                category: req.body.category,
                price: req.body.price,
                productDescription: req.body.productDescription,
                image: req.body.image
            },
            { new: true, runValidators: true } 
        );

        if (!updatedProduct) {
            return res.status(404).send({
                message: "Product not found"
            });
        }

        res.send({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        console.error({
            message: "Error encountered while updating data", error
        });
        res.status(500).send({
            message: "Internal server error",
            error: error.message
        });
    }
});

//Get all orders
app.get('/api/orders', async(req, res) => {
    try {
        const orders = await Orders.find();
        res.status(200).send(orders);
    } catch(error) {
        console.error({
            message: "Error occured while fetching data"
        })
    }
});

//Add order
app.post('/api/users/:id/orders', async(req, res) => {
    try {
        const userID = req.params.userID;
        const items = req.body.items;
        const total = req.body.total;

        if (!userID && !items && !total) 
        {
            return res.status(400).send({
                message: "Fields cannot be empty"
            })
        }
        const order = await Orders.create(
            {
                userID: userID,
                items: items,
                total: total,
            }
        )

        await order.save().then(data => {
            res.send({
                message: "Order added successfully",
                order: data
            })
        })

    } catch(error) {
        console.error({
            message: "Error occured while adding product", error
        })
    }
});

//Delete order
app.delete('/api/orders/id', async(req, res) => {
    try {
        const id = req.body.id;

        if (!id) {
            return res.status(400).send({
                message: "id parameter cannot be empty"
            })
        }

        const orderID = Orders.deleteOne(
            { _id: id }
        );

        if (orderID.length === 0) {
            res.status(400).send({
                message: "Order not found"
            })
        };
        res.status(200).json(orderID);
    } catch(error) {
        console.error({
            message: "Error occured while deleting order", error
        })
    }
});

//Update order by id
app.patch('/api/orders/id', async(req, res) => {
    try {
        const id = req.body.id
        if (!id) {
            return res.status(400).send({
                message: "id parameter is required"
            })
        }
        const order = await Products.replaceOne(
            { _id: id },
            { items: req.body.items,
              total: req.body.total,
              orderStatus: req.body.orderStatus,
              createdAt: req.body.createdAt,
            }
        )
        await order.save().then(data => {
            res.send({
                message: "Order updated successfully",
                product: data
            })
        })

    } catch(error) {
        console.error({
            message: "Error encountered while updating order", error
        })
    }
});

//Add to cart
app.post('/api/users/:id/cart', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.params.id; 

        if (!productId || !quantity) {
            return res.status(400).send({
                message: "Product and quantity are required"
            });
        }

        let cart = await Cart.findOne({ userId });

        if (cart) {
            const productIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            );

            if (productIndex >= 0) {
                cart.items[productIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        } else {
            cart = await Cart.create({
                userId,
                items: [{ productId, quantity }],
            });
        }


        await cart.save();
        res.status(200).send({ message: "Cart updated successfully", cart });
    } catch (error) {
        console.error("Error while updating cart:", error);
        res.status(500).send({ message: "Internal server error", error });
    }
});

//Get Cart
app.get('/api/users/:id/cart', async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.id); 
        console.log("Received userId:", userId);

        let cart = await Cart.aggregate([
            { 
                $match: { 
                    userId: userId  
                }
            },
            { 
                $unwind: "$items" 
            },
            {
                $lookup: {
                    from: "products", 
                    localField: "items.productId", 
                    foreignField: "_id", 
                    as: "productDetails" 
                }
            },
            { 
                $unwind: "$productDetails" 
            },
            {
                $addFields: {
                    totalPrice: { $multiply: ["$items.quantity", "$productDetails.price"] } 
                }
            },
            {
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" }, 
                    items: {
                        $push: {
                            productId: "$items.productId",
                            quantity: "$items.quantity",
                            productName: "$productDetails.name",
                            productImage: "$productDetails.image",
                            pricePerUnit: "$productDetails.price", 
                            totalPrice: "$totalPrice" 
                        }
                    }
                }
            }
        ]);
        //Debugging purposes
        console.log("Found cart:", cart);


        if (!cart.length) {
            return res.status(200).send({ 
                userId: userId, 
                items: [] 
            });
        }

        res.status(200).send(cart[0]);

    } catch (error) {
        console.error("Error while fetching cart:", error);
        res.status(500).send({ message: "Internal server error", error });
    }
});

//Update cart item
app.patch('/api/users/:id/cart', async(req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.params.id;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be a positive number" });
    }

    try {
        let updatedRecord = await Cart.updateOne(
            { userId: userId, "items.productId": productId },
            { $set: { "items.$.quantity": quantity } } 
        );

        res.status(200).send({ message: "Item updated successfully", updatedRecord });

    } catch(error) {
        console.error("Error occured while updating ", error);
    }
})

// Delete cart item
app.delete('/api/users/:id/cart', async (req, res) => {
    const { productId } = req.body; 
    const userId = req.params.id; 

    try {

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }


        const itemIndex = cart.items.findIndex((item) => item.productId == productId);

        if (itemIndex === -1) {
            return res.status(404).send({ message: "Item not found in cart" });
        }


        cart.items.splice(itemIndex, 1);

        cart = await cart.save();

        res.status(200).send(cart); 
    } catch (error) {
        console.error("Error occurred while deleting item from cart:", error);
        res.status(500).send({ message: "Failed to delete item from cart" });
    }
});

//Proceed to checkout
app.post('/api/users/:id/cart/checkout', async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.params.id);
  
    try {
      if (!stripe) {
        return res.status(500).json({
          error: "Stripe not initialised"
        });
      }
  

      const cartData = await Cart.aggregate([
        { $match: { userId: userId } },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        { $unwind: "$productDetails" },
        {
          $addFields: {
            totalPrice: { $multiply: ["$items.quantity", "$productDetails.price"] }
          }
        },
        {
          $group: {
            _id: "$_id",
            userId: { $first: "$userId" },
            items: {
              $push: {
                productId: "$items.productId",
                quantity: "$items.quantity",
                productName: "$productDetails.name",
                productImage: "$productDetails.image",
                pricePerUnit: "$productDetails.price",
                totalPrice: "$totalPrice"
              }
            }
          }
        }
      ]);
  
      if (!cartData.length) {
        return res.status(404).json({ error: "Cart not found for user" });
      }
  
      const cartItems = cartData[0].items;
  
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: "No items in cart" });
      }
  
      // Create a Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: cartItems.map((item) => ({
          price_data: {
            currency: "ZAR",
            product_data: {
              name: item.productName,
              images: [`http://localhost:8000${item.productImage}`]
            },
            unit_amount: Math.round(item.pricePerUnit * 100), // Convert to cents
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cancel",
      });
  
      // Respond with the session ID
      res.status(200).json({
        sessionId: session.id
      });
    } catch (error) {
      console.error("Error occurred", error);
      res.status(500).json({ error: "An error occurred while processing checkout" });
    }
  });

mongoose.connect(process.env.dbURL)
.then(() => {
    console.log("Successfully connected to database");
    app.listen(8000, () => {
        console.log(`Server is running on port 8000`);
    });
})
.catch((error) => {
    console.log('Error encountered while connecting to database: ', error)
})