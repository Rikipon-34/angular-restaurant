import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Menu } from '../model/menu';
import { FormsModule } from '@angular/forms';
import { Order } from '../model/order';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  allMenuItems: Menu[] = [];
  orders: Order[] = [];
  Object: any;
  showOrderForm = false;
  selectedMenuItem: Menu;
  showOrderSummary = false;
  id: number;
  nomePiatto: string[] = [];
  quantita: number = 1;
  prezzoTotale: number = 0;
  selectedItems: Menu[] = [];
  categorizedMenuItems: { [category: string]: Menu[] } = {
    primo: [],
    secondo: [],
    antipasto: [],
    bevande: [],
  };

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMenuItems();
  }

  OnMenuFetch() {
    this.fetchMenuItems();
  }
  toggleOrderSummary(): void {
    this.showOrderSummary = !this.showOrderSummary;
  }
  fetchMenuItems(): void {
    this.http
      .get<Menu[]>('http://localhost:8080/api/menu/all')
      .subscribe((menuItems) => {
        console.log(menuItems);
        this.allMenuItems = menuItems;
        this.groupMenuItemsByCategory();
      });
  }

  groupMenuItemsByCategory(): void {
    this.categorizedMenuItems = {
      primo: [],
      secondo: [],
      antipasto: [],
      bevande: [],
    };

    this.allMenuItems.forEach((menuItem) => {
      switch (menuItem.categoria.toLowerCase()) {
        case 'primo':
          this.categorizedMenuItems['primo'].push(menuItem);
          break;
        case 'secondo':
          this.categorizedMenuItems['secondo'].push(menuItem);
          break;
        case 'antipasto':
          this.categorizedMenuItems['antipasto'].push(menuItem);
          break;
        case 'bevande':
          this.categorizedMenuItems['bevande'].push(menuItem);
          break;
        default:
          break;
      }
    });
  }

  order: Menu[] = [];

  addToOrder(dish: Menu, quantity: number): void {
    const index = this.selectedItems.findIndex((item) => item.id === dish.id);
    if (index === -1) {
      dish.quantita = quantity;
      this.selectedItems.push(dish);
      this.nomePiatto.push(dish.nome);
      console.log('Piatti selezionati:', this.nomePiatto);
      this.calculateTotalPrice();
    } else {
      this.selectedItems[index].quantita += quantity;
      console.log(
        'Quantità aggiornata per',
        dish.nome,
        'Nuova quantità:',
        this.selectedItems[index].quantita
      );
    }
  }

  getQuantityForItem(nomePiatto: string): number {
    const order = this.orders.find((order) =>
      order.nomePiatti.includes(nomePiatto)
    );

    if (!order) {
      return 0;
    }

    const index = order.nomePiatti.indexOf(nomePiatto);
    return order.quantita[index];
  }

  removeFromOrder(dish: Menu): void {
    const index = this.selectedItems.findIndex((item) => item.id === dish.id);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
      this.nomePiatto.splice(index, 1);
      console.log('Piatti selezionati:', this.nomePiatto);
      this.calculateTotalPrice();
    }
  }

  resetOrderSummary(): void {
    this.orders = [];
  }

  generateSummary(): string {
    let totalPrice = 0;
    const summary = this.selectedItems.map((item) => {
      const itemTotalPrice = item.prezzo * item.quantita;
      totalPrice += itemTotalPrice;
      return `${item.nome} (Quantità: ${item.quantita}, Prezzo: ${itemTotalPrice}€)`;
    });
    return `${summary.join(', ')} - Prezzo Totale: ${totalPrice}€`;
  }

  calculateTotalPrice(): void {
    this.prezzoTotale = this.selectedItems.reduce((total, item) => {
      return total + item.prezzo * item.quantita;
    }, 0);
  }

  submitOrder(): void {
    if (this.selectedItems.length > 0) {
      console.log('Riepilogo ordine:', this.generateSummary());
      console.log('Prezzo totale:', this.prezzoTotale);

      const totalQuantity = this.selectedItems.reduce(
        (total, item) => total + item.quantita,
        0
      );

      const order: Order = {
        nomePiatti: this.selectedItems.map((item) => item.nome),
        quantita: totalQuantity,
        prezzoTotale: this.prezzoTotale,
        id: this.id,
      };

      this.http
        .post<Order>('http://localhost:8080/api/orders', order)
        .subscribe(
          (response) => {
            console.log('Ordine inviato con successo:', response);
            this.orders.push(response);
            this.resetOrderForm();
          },
          (error) => {
            console.error("Errore durante l'invio dell'ordine:", error);
          }
        );
    } else {
      console.error("Seleziona almeno un piatto prima di inviare l'ordine.");
    }
  }

  openOrderForm(): void {
    this.showOrderForm = true;
  }

  closeOrderForm(): void {
    this.showOrderForm = false;
    this.resetOrderForm();
  }
  getQuantitiesForOrder(order: Order): { [key: string]: number } {
    const quantities: { [key: string]: number } = {};
    order.nomePiatti.forEach((nomePiatto, index) => {
      const quantity = order.quantita[index];
      quantities[nomePiatto] = quantity;
    });

    return quantities;
  }

  resetOrderForm(): void {
    this.selectedItems = [];
    this.nomePiatto = [];
    this.quantita = 1;
    this.prezzoTotale = 0;
  }

  getItemsByCategory(categories: string): Menu[] {
    return this.allMenuItems.filter((item) => item.categoria === categories);
  }

  logoutAndGoBack(): void {
    this.router.navigate(['/login']);
  }
}
