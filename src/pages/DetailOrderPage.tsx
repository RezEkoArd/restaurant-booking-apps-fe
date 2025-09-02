import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams, } from "react-router-dom";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Plus, 
  Minus, 
  User, 
  Printer,
  Save,
  ChefHat,
  Loader2
} from "lucide-react";
import { menuService } from "@/services/menuService";
import { useAuth } from "@/hooks/useAuth";
import { type Menu, type OrderItem } from "@/types";
import { orderService } from "@/services/orderService";


  interface OrderItemUI {
  id: number;
  menu: Menu;
  quantity: number;
  notes?: string;
}

const DetailOrderPage = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
   const tableId = id ? id.replace('T', '') : '';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState("");
  const [menus, setMenus] = useState<Menu[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItemUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingToKitchen, setSendingToKitchen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const menusData = await menuService.getMenus();
        setMenus(menusData);
      } catch (error) {
        console.error('Error fetching menu:', error);
        alert('Gagal memuat menu. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // Get unique categories from menu items
  const categories = ["All", ...new Set(menus.map(menu => menu.category))]
  
  const filteredMenus = menus.filter(menu => 
    (selectedCategory === "All" || menu.category === selectedCategory) &&
    menu.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToOrder = (menu: Menu) => {
    const existingItem = orderItems.find(item => item.menu.id === menu.id);
    
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.menu.id === menu.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newOrderItem: OrderItemUI = {
        id: Date.now(),
        menu,
        quantity: 1
      };
      setOrderItems([...orderItems, newOrderItem]);
    }
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setOrderItems(orderItems.filter(item => item.id !== itemId));
    } else {
      setOrderItems(orderItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const sendToKitchen = async () => {
    if (orderItems.length === 0) return;

    setSendingToKitchen(true);
    try {
      // Convert UI order items to API order items
      const orderItemsApi: OrderItem[] = orderItems.map(item => ({
        id: 0, // Will be assigned by backend
        order_id: 0, // Will be assigned by backend
        menu_id: item.menu.id,
        quantity: item.quantity,
        price: item.menu.price,
        subtotal: (parseFloat(item.menu.price) * item.quantity).toString()
      }));

      const response = await menuService.createOrder(parseInt(tableId), orderItemsApi);
      
      if (response) {
        alert('Order berhasil dikirim ke dapur!');
        setOrderItems([]);
        // Optional: redirect to orders list or stay on page
        navigate('/orders');
      } else {
        alert('Gagal mengirim order');
      }
    } catch (error: any) {
      console.error('Error sending to kitchen:', error);
      alert('Terjadi error saat mengirim order: ' + error.message);
    } finally {
      setSendingToKitchen(false);
    }
  };

   const getTotalAmount = () => {
    return orderItems.reduce((total, item) => 
      total + (parseFloat(item.menu.price) * item.quantity), 0
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading menu...</span>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Menu */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Table {id}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4" />
            <span>{user?.name || 'Pelayan'}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`whitespace-nowrap ${
                selectedCategory === category 
                  ? "bg-gray-900 text-white" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {filteredMenus.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada menu ditemukan</p>
            </div>
          ) : (
            filteredMenus.map((menu) => (
              <Card 
                key={menu.id} 
                className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                onClick={() => addToOrder(menu)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{menu.name}</h3>
                      {/* <p className="text-sm text-gray-600 mb-2">{menu.description || 'Tidak ada deskripsi'}</p> */}
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(parseFloat(menu.price))}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      className="ml-4 bg-gray-900 hover:bg-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToOrder(menu);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Current Order */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Order Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Saat Ini</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Table {id}</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString('id-ID')}</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {orderItems.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada item dalam order</p>
              <p className="text-sm text-gray-400">Pilih menu untuk memulai</p>
            </div>
          ) : (
            orderItems.map((item) => (
              <Card key={item.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.menu.name}</h4>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(parseFloat(item.menu.price))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatCurrency(parseFloat(item.menu.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => updateQuantity(item.id, 0)}
                    >
                      Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Order Summary */}
        {orderItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span>{formatCurrency(getTotalAmount())}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white gap-2 py-3"
                onClick={sendToKitchen}
                disabled={sendingToKitchen}
              >
                {sendingToKitchen ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChefHat className="h-4 w-4" />
                )}
                {sendingToKitchen ? 'Mengirim...' : 'Kirim ke Dapur'}
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => console.log("Save Draft clicked")}
                >
                  <Save className="h-4 w-4" />
                  Simpan Draft
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => console.log("Print Bill clicked")}
                >
                  <Printer className="h-4 w-4" />
                  Print Bill
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
};

export default DetailOrderPage;
