"use client"
import Header from '@/components/Header'
import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Home() {
  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([])
  const [alert, setAlert] = useState("")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingaction, setLoadingaction] = useState(false)
  const [dropdown, setDropdown] = useState([])


  useEffect(() => {
    // Fetch products on load 
    const fetchProducts = async () => {
      const response = await fetch('/api/product')
      let rjson = await response.json()
      setProducts(rjson.allProduct)
      console.log(products)
    }
    fetchProducts()
  }, [products])


  const buttonAction = async (action, slug, initialQuantity) => {
    // Immediately change the quantity of the product with given slug in Products
    let index = products.findIndex((item) => item.slug == slug)
    let newProducts = JSON.parse(JSON.stringify(products))

    // DELETE
    if (action === "delete") {
      // Perform delete action
      setLoadingaction(true);

      const requestBody = { slug };
      // Send delete request to the API

      const response = await fetch('/api/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        // Item deleted successfully
        notify("Your Product has been deleted!")
        setAlert("Your Product has been deleted!");

      } else {
        // Handle error case
        notify("Error deleting product")
        console.error('Error deleting product');
      }
    } else if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1
    }
    else if (action == "minus") {
      newProducts[index].quantity = parseInt(initialQuantity) - 1
    }

    setProducts(newProducts)

    // Immediately change the quantity of the product with given slug in Dropdown
    let indexdrop = dropdown.findIndex((item) => item.slug == slug)
    let newDropdown = JSON.parse(JSON.stringify(dropdown))
    if (action == "plus") {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1
    }
    else if (action == "minus") {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1
    }
    setDropdown(newDropdown)

    setLoadingaction(true)
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, slug, initialQuantity })
    });
    let r = await response.json()
    setLoadingaction(false)
  }

  const addProduct = async (e) => {
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });

      if (response.ok) {
        // Product added successfully
        setProductForm({})
        notify("Your Product has been added!")
      } else {
        // Handle error case
        console.error('Error adding product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    // Fetch all the products again to sync back
    const response = await fetch('/api/product')
    let rjson = await response.json()
    setProducts(rjson.products)
    e.preventDefault();
  }

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  const onDropdownEdit = async (e) => {
    let value = e.target.value
    setQuery(value)
    if (value.length > 3) {
      setLoading(true)
      setDropdown([])
      const response = await fetch('/api/search?query=' + query)
      let rjson = await response.json()
      setDropdown(rjson.products)
      setLoading(false)
    }
    else {
      setDropdown([])
    }
  }
  const notify = (msg) => toast(msg);
  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} type="success" />
      <div className='contain1'>
        <div className="container mx-auto my-8">
          <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>
          <div className="flex mb-2">
            <input onChange={onDropdownEdit} type="text" placeholder="Enter a product name" className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md" />
            {/* <select className="border border-gray-300 px-4 py-2 rounded-r-md">
            <option value="">All</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </select> */}
          </div>
          {loading && <div className='flex justify-center items-center'> <img width={74} src="/loading.svg" alt="" /> </div>
          }
          <div className="dropcontainer absolute w-[72vw] border-1 bg-purple-100 rounded-md ">

            {dropdown.map(item => {
              return <div key={item.slug} className="container flex justify-between p-2 my-1 border-b-2">

                <span className="slug"> {item.slug} ({item.quantity} available for ₹{item.price})</span>
                <div className='mx-5'>
                  <button onClick={() => { buttonAction("minus", item.slug, item.quantity) }} disabled={loadingaction} className="subtract inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"> - </button>

                  <span className="quantity inline-block  min-w-3 mx-3">{item.quantity}</span>
                  <button onClick={() => { buttonAction("plus", item.slug, item.quantity) }} disabled={loadingaction} className="add inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200">  + </button>

                </div>
              </div>
            })}
          </div>
        </div>
      </div>
      <div className='contain'>
        <div className='left'>
          {/* Display Current Stock  */}
          <div className="container mx-auto my-8">
            <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>

            <form>
              <div className="mb-4">
                <label htmlFor="productName" className="block mb-2">Product Name</label>
                <input value={productForm?.slug || ""} name='slug' onChange={handleChange} placeholder='Enter Product Name' type="text" id="productName" className="w-full border border-gray-300 px-4 py-2" />
              </div>

              <div className="mb-4">
                <label htmlFor="quantity" className="block mb-2">Quantity</label>
                <input value={productForm?.quantity || ""} name='quantity' onChange={handleChange} type="number" placeholder='Enter Product Quantity' id="quantity" className="w-full border border-gray-300 px-4 py-2" />
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="block mb-2">Price</label>
                <input value={productForm?.price || ""} name='price' onChange={handleChange} type="number" id="price" placeholder='Enter Product Price' className="w-full border border-gray-300 px-4 py-2" />
              </div>

              <button onClick={addProduct} type="submit" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold">
                Add Product
              </button>


            </form>
          </div >

        </div >


        <div className="container  my-8 mx-auto">
          <div className='right'>
            <h1 className="text-3xl font-semibold mb-6">Current Stock</h1>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Product Name</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {products?.map(product => {
                  return <tr key={product.slug}>
                    <td className="border px-4 py-2">{product.slug}</td>
                    <td className="border px-4 py-2">{product.quantity}</td>
                    <td className="border px-4 py-2">₹{product.price}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => buttonAction("delete", product.slug, product.quantity)}
                        disabled={loadingaction}
                        className="delete inline-block px-1 py-1 cursor-pointer bg-red-500 text-white font-semibold rounded-lg shadow-md disabled:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                })}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}