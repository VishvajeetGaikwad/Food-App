import { IndianRupee } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import { CartItem } from "@/types/cartType";

const Success = () => {
  const { orders, getOrderDetails } = useOrderStore();

  useEffect(() => {
    getOrderDetails();
    console.log("Orders:", orders);
  }, [getOrderDetails]);

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
          Order not found!
        </h1>
      </div>
    );
  }

  // Initialize an object to keep track of ordered items
  const orderedItemsMap: { [key: string]: CartItem } = {};

  // Loop through each order and its cart items
  orders.forEach((order) => {
    order.cartItems.forEach((item: CartItem) => {
      // If the item is already recorded, add its quantity
      if (orderedItemsMap[item._id]) {
        orderedItemsMap[item._id].quantity += item.quantity; // Update quantity
      } else {
        // Otherwise, add the item to the map
        orderedItemsMap[item._id] = { ...item, quantity: item.quantity }; // Initialize quantity
      }
    });
  });

  // Convert the ordered items map back into an array
  const uniqueOrderedItems = Object.values(orderedItemsMap);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 mt-[70px]">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Order Status:{" "}
            <span className="text-[#FF5A5A]">{"confirm".toUpperCase()}</span>
          </h1>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Order Summary
          </h2>
          {/* Display unique ordered items */}
          {uniqueOrderedItems.map((item: CartItem) => (
            <div key={item._id} className="mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-md object-cover"
                  />
                  <h3 className="ml-4 text-gray-800 dark:text-gray-200 font-medium">
                    {item.name} (x{item.quantity}) {/* Show quantity */}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-gray-800 dark:text-gray-200 flex items-center">
                    <IndianRupee />
                    <span className="text-lg font-medium">
                      {item.price * item.quantity} {/* Calculate total price */}
                    </span>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
            </div>
          ))}
        </div>
        <Link to="/cart">
          <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-md shadow-lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
