import { MenuItem } from "@/types/restaurantType";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useCartStore } from "@/store/useCartStore";
import { useNavigate } from "react-router-dom";

const AvailableMenu = ({ menus }: { menus: MenuItem[] }) => {
  const { addToCart } = useCartStore();
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <h1 className="text-xl md:text-2xl font-extrabold mb-6">
        Available Menus
      </h1>
      {/* Added gap-y-8 for more space between rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-y-8">
        {menus.map((menu: MenuItem) => (
          <Card
            key={menu._id}
            className="w-full md:w-72 h-auto flex flex-col shadow-lg rounded-lg overflow-hidden"
          >
            {/* Fixed height and width for image */}
            <div className="w-full h-48">
              <img
                src={menu.image}
                alt={menu.name}
                className="w-full h-full object-cover"
              />
            </div>

            <CardContent className="p-4 flex-grow flex flex-col">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {menu.name}
              </h2>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2 overflow-hidden">
                {menu.description}
              </p>
              <h3 className="text-lg font-semibold mt-4">
                Price: <span className="text-[#D19254]">{menu.price}</span>
              </h3>
            </CardContent>

            <CardFooter className="p-4 mt-auto">
              <Button
                onClick={() => {
                  addToCart(menu);
                  navigate("/cart");
                }}
                className="w-full bg-orange hover:bg-hoverOrange"
              >
                Add to cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableMenu;
