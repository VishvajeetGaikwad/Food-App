import { Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState } from "react";
import CheckoutConfirmPage from "./CheckoutConfirmPage";
import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "../types/cartType";
import { useNavigate } from "react-router-dom";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import CartImage from "@/assets/pngwing.com.png";

const Cart = () => {
  const [open, setOpen] = useState<boolean>(false);
  const {
    cart,
    decrementQuantity,
    incrementQuantity,
    removeFromTheCart,
    clearCart,
  } = useCartStore(); // Add clearCart here
  const navigate = useNavigate();
  const { singleRestaurant } = useRestaurantStore();
  const restaurantId = singleRestaurant?._id;
  let totalAmount = cart.reduce(
    (acc, ele) => acc + Number(ele.price) * Number(ele.quantity),
    0
  );

  return (
    <div className="flex flex-col max-w-7xl mx-auto my-10 mt-[70px]">
      <div className="flex justify-end">
        <Button variant="link" onClick={clearCart}>
          Clear All
        </Button>{" "}
        {/* Add the clearCart call */}
      </div>

      {cart.length === 0 ? (
        <div className="text-center my-10">
          <p className="text-2xl font-semibold">Your cart is empty.</p>
          <p className="text-lg text-gray-600">
            Please add something to your cart!
          </p>
          <img
            src={CartImage}
            alt=""
            className="mx-auto w-1/2 h-auto max-w-sm"
          />
          <Button
            className="mt-4 bg-orange hover:bg-hoverOrange"
            onClick={() => navigate(`/restaurant/${restaurantId}`)}
          >
            Let's Grab Something to eat
          </Button>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Items</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item: CartItem) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={item.image} alt={item.name} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>
                    <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md">
                      <Button
                        onClick={() => decrementQuantity(item._id)}
                        size="icon"
                        variant="outline"
                        className="rounded-full bg-gray-200"
                      >
                        <Minus />
                      </Button>
                      <Button
                        size="icon"
                        className="font-bold border-none"
                        disabled
                        variant="outline"
                      >
                        {item.quantity}
                      </Button>
                      <Button
                        onClick={() => incrementQuantity(item._id)}
                        size="icon"
                        className="rounded-full bg-orange hover:bg-hoverOrange"
                        variant="outline"
                      >
                        <Plus />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{item.price * item.quantity}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="bg-orange hover:bg-hoverOrange"
                      onClick={() => removeFromTheCart(item._id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="text-2xl font-bold">
                <TableCell colSpan={5}>Total</TableCell>
                <TableCell className="text-right">{totalAmount}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <div className="flex justify-end my-5">
            <Button
              onClick={() => setOpen(true)}
              className="bg-orange hover:bg-hoverOrange"
            >
              Proceed To Checkout
            </Button>
          </div>
        </>
      )}

      <CheckoutConfirmPage open={open} setOpen={setOpen} />
    </div>
  );
};

export default Cart;
