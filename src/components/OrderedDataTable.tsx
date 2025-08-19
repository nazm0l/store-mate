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
import { Button } from "@/components/ui/button";

export function OrderedDataTable({
  orderedProducts,
  handleRemove,
  handleQuantity,
  calculateSubTotalById,
}: {
  orderedProducts: any[];
  handleRemove: (id: any) => void;
  handleQuantity: (id: any, type: string) => void;
  calculateSubTotalById: (id: any) => number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Subtotal</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderedProducts.length > 0 ? (
          orderedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.productName}</TableCell>
              <TableCell>{product.productPrice}</TableCell>
              <TableCell>
                <div>
                  <Button
                    variant="outline"
                    className="p-2"
                    onClick={() => handleQuantity(product.id, "remove")}
                  >
                    -
                  </Button>
                  <span className="mx-4">{product.quantity}</span>
                  <Button
                    variant="outline"
                    className="p-2"
                    onClick={() => handleQuantity(product.id, "add")}
                  >
                    +
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {calculateSubTotalById(product.id)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  color="danger"
                  onClick={() => handleRemove(product.id)}
                >
                  X
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No orders
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
