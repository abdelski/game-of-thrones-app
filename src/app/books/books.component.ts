import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from './interface';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  searchValue: string = '';

  constructor(private renderer: Renderer2, private el: ElementRef, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.search(this.searchValue);
  }

  search(value:string) {
    const targetDiv = this.el.nativeElement.querySelector('.list');
    if (targetDiv) {
      this.renderer.setProperty(targetDiv, 'innerHTML', '<div class="loader"></div>');
    }

    if (this.route.snapshot.queryParams["name"] || value) {
      const name = (value.length > 0) ? value : this.route.snapshot.queryParams["name"];
      this.updateQueryName(name);
      const url = `https://www.anapioficeandfire.com/api/books?name=${name.replace(/ /g, "%20")}`;
      fetch(url)
      .then(res => res.json())
      .then(res => this.renderList(res))
      .catch((err) => console.log(`ERROR: ${err.message}`));
    } else if (this.route.snapshot.queryParams["id"]) {
      const id = this.route.snapshot.queryParams["id"];
      this.updateQueryId(id);
      const url = `https://www.anapioficeandfire.com/api/books/${id}`;
      fetch(url)
      .then(res => res.json())
      .then(res => this.renderDescription([res]))
      .catch((err) => console.log(`ERROR: ${err.message}`));
    } else {
      const url = "https://www.anapioficeandfire.com/api/books";
      fetch(url)
      .then(res => res.json())
      .then(res => this.renderList(res))
      .catch((err) => console.log(`ERROR: ${err.message}`));
    }
  }
  
  renderList(list:Book[]) {
    let listJsx:string = '';
    for (let item of list) {
      const id = item.url.split('/')
      listJsx += `
        <a class="card" href="${window.location.origin}/books?id=${id[id.length - 1]}">
          <div class="name">${item.name}</div>
          <div class="description">${item.authors.join(', ')}</div>
        </a>
      `
    }
    const targetDiv = this.el.nativeElement.querySelector('.list');
    if (targetDiv) {
      this.renderer.setProperty(targetDiv, 'innerHTML', listJsx);
    }
  }
  
  renderDescription(list:Book[]) {
    const renderCharacters = (characters:string[]) => {
      let listJsx:string = '';
      for (let [i, item] of characters.entries()) {
        const items = item.split('/')
        listJsx += `
          <a class="description" href="${window.location.origin}/characters?id=${items[items.length - 1]}">${window.location.origin}/characters?id=${items[items.length - 1]}</a><br>
        `
        if (i > 10) break;
      }
      return listJsx;
    }

    let listJsx:string = '';
    for (let item of list) {
      listJsx += `
        <h1>${item.name}</h1>
        <span class="title">Authors:</span>
        <span class="description">${item.authors.join(', ')}</span><br>
        <span class="title">Country:</span>
        <span class="description">${item.country}</span><br>
        <span class="title">Publisher:</span>
        <span class="description">${item.publisher}</span><br>
        <span class="title">Released:</span>
        <span class="description">${item.released}</span><br>
        <span class="title">ISBN:</span>
        <span class="description">${item.isbn}</span><br>
        <span class="title">Characters:</span><br>
        ${renderCharacters(item.characters)}
        <span class="description">...</span><br>
      `
    }

    const targetDiv = this.el.nativeElement.querySelector('.list');
    if (targetDiv) {
      this.renderer.setProperty(targetDiv, 'innerHTML', listJsx);
    }
  }
  
  updateQueryId(id:string) {
    const currentParams = this.route.snapshot.queryParams;
    const updatedParams = { ...currentParams, id: id };
    this.router.navigate([], { queryParams: updatedParams });
  }
  
  updateQueryName(name:string) {
    const currentParams = this.route.snapshot.queryParams;
    const updatedParams = { ...currentParams, name: name };
    this.router.navigate([], { queryParams: updatedParams });
  }

}
