"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

//Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

//Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface Product {
  title: String;
  sku: String;
  description: String;
  qty: Number;
}

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [loginDialogTitle, setLoginDialogTitle] = useState("");
  const [loginDialogDescription, setLoginDialogDescription] = useState("");
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const triggerAlertDialog = () => setOpenAlertDialog(true);
  const closeAlertDialog = () => setOpenAlertDialog(false);

  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const triggerLoginDialog = () => setOpenLoginDialog(true);
  const closeLoginDialog = () => setOpenLoginDialog(false);

  const [openSignUpDialog, setOpenSignUpDialog] = useState(false);
  const triggerSignUpDialog = () => setOpenSignUpDialog(true);
  const closeSignUpDialog = () => setOpenSignUpDialog(false);

  const [user, setUser] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);

  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  const triggerAddItemDialog = () => setOpenAddItemDialog(true);
  const closeAddItemDialog = () => setOpenAddItemDialog(false);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [qty, setQty] = useState(0);
  const [image, setImage] = useState<File[]>([]);

  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    if (Cookies.get("user_data") != null) {
      setUser(JSON.parse(Cookies.get("user_data") || "null").email);
      setUserType(JSON.parse(Cookies.get("user_data") || "null").type);
    }
    axios
      .get(process.env.NEXT_PUBLIC_BACKEND_API + "/api/products", {
        headers: {
          "ngrok-skip-browser-warning": true,
        },
      })
      .then((response) => {
        setProducts(response.data);
      });
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required!");
      return;
    }
    if (!password) {
      setError("Password is required!");
      return;
    }

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/api/user/signup",
        {
          email,
          password,
        },
        {
          headers: {
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      Cookies.set(
        "user_data",
        JSON.stringify({
          email: response.data.user,
          type: response.data.user.includes("admin") ? "admin" : "user",
        }),
        {
          expires: 3 / 24,
        }
      );
      closeSignUpDialog();
      setUser(response.data.user);
      setUserType(response.data.user.includes("admin") ? "admin" : "user");
      // console.log(response.data.user);
    } catch (error: any) {
      // console.log(error);
      setLoginDialogTitle("Failed!");
      setLoginDialogDescription(error.response.data.error);
      triggerAlertDialog();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Email is required!");
      return;
    }
    if (!password) {
      setError("Password is required!");
      return;
    }

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/api/user/login",
        {
          email,
          password,
        },
        {
          headers: {
            "ngrok-skip-browser-warning": true,
          },
        }
      );

      // console.log(response);
      setLoginDialogTitle("Success!");
      setLoginDialogDescription(response.data.message);
      triggerAlertDialog();
      Cookies.set(
        "user_data",
        JSON.stringify({
          email: response.data.user.email,
          type: response.data.user.email.includes("admin") ? "admin" : "user",
        }),
        {
          expires: 3 / 24,
        }
      );
      closeLoginDialog();
      setUser(response.data.user.email);
      setUserType(
        response.data.user.email.includes("admin") ? "admin" : "user"
      );
      setEmail("");
      setPassword("");
      // window.location.href = "/";
    } catch (error: any) {
      setLoginDialogTitle("Failed!");
      setLoginDialogDescription(error.response.data.message);
      triggerAlertDialog();
    }
  };

  const logout = (e: React.MouseEvent) => {
    e.preventDefault();
    Cookies.remove("user_data");
    localStorage.removeItem("cart");
    setUser(null);
    setUserType(null);
    // window.location.href = "/";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get selected files
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setImage(Array.from(selectedFiles));
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name) {
      setError("Name is required!");
      return;
    }
    if (!sku) {
      setError("SKU is required!");
      return;
    }
    if (!description) {
      setError("Description is required!");
      return;
    }
    if (qty <= 0) {
      setError("Qty min 1");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", name);
      formData.append("sku", sku);
      formData.append("description", description);
      formData.append("qty", qty.toString());
      image.forEach((x) => {
        formData.append("images", x); // 'images' can be an array on the server side
      });
      const response_item = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      if (response_item.status == 201) {
        closeAddItemDialog();
        setLoginDialogTitle("Success!");
        setLoginDialogDescription("Success add item!");
        triggerAlertDialog();
        axios
          .get(process.env.NEXT_PUBLIC_BACKEND_API + "/api/products", {
            headers: {
              "ngrok-skip-browser-warning": true,
            },
          })
          .then((response) => {
            setProducts(response.data);
          });
      }
    } catch (error: any) {
      setLoginDialogTitle("Failed!");
      setLoginDialogDescription(error.response.data.message);
      triggerAlertDialog();
    }
  };

  const addToCart = (product: any) => {
    // console.log(product);
    setCart((prevCart) => {
      // Check if the product is already in the cart
      const existingItem = prevCart.find(
        (item) => item.product._id === product._id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prevCart, { product, qty: 1 }];
    });
    setLoginDialogTitle("Success add item to cart!");
    triggerAlertDialog();
  };

  const removeFromCart = (product: any) => {
    setCart((prevCart) => prevCart.filter((item) => item.sku !== sku));
  };

  return (
    <div>
      <div className="bg-blue-400 flex justify-between">
        <h5 className="text-2xl text-white px-10 py-4">Nicho Shop's</h5>
        <div className="justify-end">
          {user == null ? (
            <>
              <Dialog open={openLoginDialog} onOpenChange={setOpenLoginDialog}>
                <DialogTrigger asChild>
                  <Button className="my-4 mr-5" variant="outline">
                    Log In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleLogin}>
                    <DialogHeader>
                      <DialogTitle className="text-3xl">Log In</DialogTitle>
                      <DialogDescription className="text-lg">
                        Welcome to Nicho Shop's!
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          type="text"
                          id="email"
                          placeholder="example@nicoshops.com"
                          className="col-span-3"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                          Password
                        </Label>
                        <Input
                          type="password"
                          id="password"
                          placeholder="*******"
                          className="col-span-3"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      {error && <p className="text-red-600">{error}</p>}
                      <Button
                        className="bg-blue-300"
                        type="submit"
                        variant="outline"
                      >
                        Log Me In!
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog
                open={openSignUpDialog}
                onOpenChange={setOpenSignUpDialog}
              >
                <DialogTrigger asChild>
                  <Button className="my-4 mr-5" variant="outline">
                    Sign Up
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleSignup}>
                    <DialogHeader>
                      <DialogTitle className="text-3xl">Sign Up</DialogTitle>
                      <DialogDescription className="text-lg">
                        Please register to Nicho Shop's!
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          type="text"
                          id="email"
                          placeholder="example@nicoshops.com"
                          className="col-span-3"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                          Password
                        </Label>
                        <Input
                          type="password"
                          id="password"
                          placeholder="*******"
                          className="col-span-3"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      {error && <p className="text-red-600">{error}</p>}
                      <Button
                        className="bg-blue-300"
                        type="submit"
                        variant="outline"
                      >
                        Sign Me Up!
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="flex">
              <HoverCard>
                <HoverCardTrigger className="m-5">
                  <ShoppingCartIcon className="text-white" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <div>
                    <h2>Cart</h2>
                    {cart.length === 0 ? (
                      <p>No items in cart</p>
                    ) : (
                      cart.map((item) => (
                        <div key={item}>
                          <p>
                            {item.product.title} - Qty: {item.qty}
                          </p>
                        </div>
                      ))
                    )}
                    <div className="flex justify-end">
                      <Link className="m-5 underline" href={"/cart"}>
                        Checkout
                      </Link>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <DropdownMenu>
                <DropdownMenuTrigger className="m-5">
                  Welcome, {user}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Link href={"/profile"}>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <Link href={"#"} onClick={logout}>
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
      <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{loginDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {loginDialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeAlertDialog}>
              Continue
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="body mx-40 my-10">
        {userType == "admin" ? (
          <>
            <Dialog
              open={openAddItemDialog}
              onOpenChange={setOpenAddItemDialog}
            >
              <DialogTrigger asChild>
                <Button className="my-4 mr-5" variant="outline">
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="lg:max-w-2xl">
                <form onSubmit={addItem}>
                  <DialogHeader>
                    <DialogTitle className="text-3xl">Add Item</DialogTitle>
                    <DialogDescription className="text-lg">
                      Please input item data
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        type="text"
                        id="name"
                        className="col-span-3"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sku" className="text-right">
                        SKU
                      </Label>
                      <Input
                        type="text"
                        id="sku"
                        className="col-span-3"
                        onChange={(e) => setSku(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        type="text"
                        id="description"
                        className="col-span-3"
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="qty" className="text-right">
                        Qty
                      </Label>
                      <Input
                        type="number"
                        id="qty"
                        className="col-span-3"
                        onChange={(e) => setQty(Number(e.target.value))}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right">
                        Image
                      </Label>
                      <Input
                        type="file"
                        multiple
                        id="image"
                        className="col-span-3"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    {error && <p className="text-red-600">{error}</p>}
                    <Button
                      className="bg-blue-300"
                      type="submit"
                      variant="outline"
                    >
                      Add Item
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <></>
        )}
        <div className="grid grid-cols-3 gap-4">
          {products.length > 0 ? (
            products.map((product: any, index: any) => (
              <Card key={index}>
                <CardHeader>
                  <Carousel>
                    <CarouselContent>
                      {product.images.map((image: any, image_index: any) => {
                        return (
                          <CarouselItem key={image_index}>
                            <img
                              src={
                                process.env.NEXT_PUBLIC_BACKEND_API +
                                `/uploads/${image}`
                              }
                              alt="Not Found"
                              height={"100px"}
                            />
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                  <CardTitle>{product.title}</CardTitle>
                  {/* <CardTitle>{index.id}</CardTitle> */}
                  <CardDescription>{product.sku}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    <span>{product.description}</span>
                    <span>Qty: {product.qty}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  {userType == "user" ? (
                    <div className="w-full flex justify-end">
                      <Button
                        className="items-end"
                        onClick={() => addToCart(product)}
                      >
                        Add to cart
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
