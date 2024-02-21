import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { Menu } from '../model/menu';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  allMenuItems: Menu[] = [];
  categorizedMenuItems: { [category: string]: Menu[] } = {
    primo: [],
    secondo: [],
    antipasto: [],
    bevande: [],
  };
  Object: any;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMenuItems();
  }

  OnMenuFetch() {
    this.fetchMenuItems();
  }

  fetchMenuItems(): void {
    this.http
      .get<Menu[]>('http://localhost:8080/api/menu/all')
      .subscribe((menuItems) => {
        console.log(menuItems);
        this.allMenuItems = menuItems;
        this.groupMenuItemsByCategory;
      });
  }
  groupMenuItemsByCategory(): void {
    // Resetta gli array di categorie
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

  getItemsByCategory(categories: string): Menu[] {
    return this.allMenuItems.filter((item) => item.categoria === categories);
  }
  logoutAndGoBack(): void {
    this.router.navigate(['/login']);
  }
}
