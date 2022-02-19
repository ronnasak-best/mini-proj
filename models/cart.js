module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {}
    this.totalQty = oldCart.totalQty || 0
    this.totalPrice = oldCart.totalPrice || 0
    this.totalItem = oldCart.totalItem || 0

    this.add = function (item, id) {
        let storedItem = this.items[id]
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0, status:true}
            this.totalItem++
            storedItem.qty++
            storedItem.price = storedItem.item.price * storedItem.qty
            this.totalQty++
            this.totalPrice += storedItem.item.price
        }else{
            return false
        }
       
    
    }
    this.addByOne = function (item, id) {
        let storedItem = this.items[id]
        if(item.quantity > storedItem.qty){
            storedItem.qty++
            storedItem.price = storedItem.item.price * storedItem.qty
            this.totalQty++
            this.totalPrice += storedItem.item.price
        }else{
            return false
        }
        // if (!storedItem) {
        //     storedItem = this.items[id] = {item: item, qty: 0, price: 0}
        //     this.totalItem++
        // }
    }

    this.reduceByOne = function (id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if(this.items[id].qty <= 0) {
            delete this.items[id]
            this.totalItem--
        }
    };

    this.removeItem = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
        this.totalItem--
    };

    this.generateArray = function () {
        const arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};