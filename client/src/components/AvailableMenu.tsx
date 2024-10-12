import { MenuItem } from "@/types/restaurantType";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart } from "lucide-react"; // Add an icon for the button
import { useNavigate } from "react-router-dom";

const AvailableMenu = ({ menus }: { menus: MenuItem[] }) => {
  const { addToCart, cart } = useCartStore(); // Access the cart and addToCart function
  const navigate = useNavigate();

  // Helper function to check if a menu item is already in the cart
  const isInCart = (menuId: string) => {
    return cart.some((item) => item._id === menuId);
  };

  return (
    <div className="p-4 relative">
      <h1 className="text-xl md:text-2xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">
        Available Menus
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-y-8">
        {menus.map((menu: MenuItem) => (
          <Card
            key={menu._id}
            className="w-full md:w-72 h-auto flex flex-col shadow-lg rounded-lg overflow-hidden"
          >
            <div className="w-full h-48">
              <img
                src={menu.image}
                alt={menu.name}
                className="w-full h-full object-cover"
              />
            </div>

            <CardContent className="p-4 flex-grow flex flex-col">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {menu.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 overflow-hidden">
                {menu.description}
              </p>
              <h3 className="text-lg font-semibold mt-4 text-gray-900 dark:text-gray-100">
                Price: <span className="text-[#D19254]">{menu.price}</span>
              </h3>
            </CardContent>

            <CardFooter className="p-4 mt-auto">
              {isInCart(menu._id) ? (
                <Button
                  disabled
                  className="w-full bg-gray-300 dark:bg-gray-600"
                >
                  Already in Cart
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    addToCart(menu);
                  }}
                  className="w-full bg-orange hover:bg-hoverOrange"
                >
                  Add to Cart
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* Floating button for cart */}
      {cart.length > 0 && (
        <Button
          className="fixed bottom-4 right-4 bg-orange hover:bg-hoverOrange shadow-lg rounded-full p-4"
          onClick={() => {
            navigate("/cart");
          }}
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="ml-2">Cart ({cart.length})</span>
        </Button>
      )}
    </div>
  );
};

export default AvailableMenu;
