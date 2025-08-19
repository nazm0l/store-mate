import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

type TotalPrice = {
  totalPrice: number;
  totalTax: number;
  totalDiscount: number;
};

export function AddSaleProductTable({
  addedProducts,
  handleQuantityChange,
  handleRemove,
  totalPrice,
}: {
  addedProducts: any[];
  handleQuantityChange: any;
  handleRemove: any;
  totalPrice: TotalPrice;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Expired Date</TableHead>
          <TableHead>Net Unit Price</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Tax</TableHead>
          <TableHead className="text-right">SubTotal</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="max-h-[100px] overflow-y-auto">
        {addedProducts &&
          addedProducts.map((product) => (
            <TableRow key={product?.id}>
              <TableCell className="font-medium">
                {product?.productName}
              </TableCell>
              <TableCell className="font-medium">{product?.code}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  name={product?.id}
                  className="w-16 h-4 text-center"
                  value={product?.quantity}
                  onChange={handleQuantityChange}
                  min={1}
                />
              </TableCell>
              <TableCell>
                {product?.expiredDate ? product?.expiredDate : "N/A"}
              </TableCell>
              <TableCell>{product?.productPrice}</TableCell>
              <TableCell>{product?.productDiscount || 0}</TableCell>
              <TableCell>
                {product?.productTax *
                  (product?.quantity ? product?.quantity : 1)}
              </TableCell>

              <TableCell className="text-right">
                {product?.productPrice *
                  (product?.quantity ? product?.quantity : 1) +
                  product?.productTax *
                    (product?.quantity ? product?.quantity : 1)}
              </TableCell>
              <TableCell className="text-right">
                <span
                  className="text-white font-bold cursor-pointer border bg-red-500 px-2 py-0 rounded "
                  onClick={() => handleRemove(product?.id)}
                >
                  X
                </span>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4} className="px-4 py-1"></TableCell>
          <TableCell className="px-4 py-1">Total</TableCell>
          <TableCell className="px-4 py-1">
            {totalPrice.totalDiscount ? totalPrice.totalDiscount : 0}
          </TableCell>
          <TableCell className="px-4 py-1">{totalPrice.totalTax}</TableCell>
          <TableCell className="text-right px-4 py-1">
            {totalPrice.totalPrice}
          </TableCell>
          <TableCell className="px-4 py-1"></TableCell>
        </TableRow>
        {/* <TableRow>
          <TableCell colSpan={4} className="px-4 py-1"></TableCell>
          <TableCell colSpan={3} className="px-4 py-1">
            Shipping
          </TableCell>
          <TableCell className="text-right px-4 py-1">
            {totalPrice.totalPrice}
          </TableCell>
          <TableCell className="px-4 py-1"></TableCell>
        </TableRow> */}
      </TableFooter>
    </Table>
  );
}
