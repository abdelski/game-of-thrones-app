import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Character } from './interface';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
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
      const url = `https://www.anapioficeandfire.com/api/characters?name=${name.replace(/ /g, "%20")}`;
      fetch(url)
      .then(res => res.json())
      .then(res => this.renderList(res))
      .catch((err) => console.log(`ERROR: ${err.message}`));
    } else if (this.route.snapshot.queryParams["id"]) {
      const id = this.route.snapshot.queryParams["id"];
      this.updateQueryId(id);
      const url = `https://www.anapioficeandfire.com/api/characters/${id}`;
      fetch(url)
      .then(res => res.json())
      .then(res => this.renderDescription([res]))
      .catch((err) => console.log(`ERROR: ${err.message}`));
    } else {
      const url = "https://www.anapioficeandfire.com/api/characters";
      fetch(url)
      .then(res => res.json())
      .then(res => this.renderList(res))
      .catch((err) => console.log(`ERROR: ${err.message}`));
    }
  }
  
  renderList(list:Character[]) {
    let listJsx:string = '';
    for (let item of list) {
      const id = item.url.split('/')
      listJsx += `
        <a class="card" href="${window.location.origin}/characters?id=${id[id.length - 1]}">
          <div class="name">${(item.name.length > 0) ? item.name : item.gender}</div>
          <div class="description">${item.aliases.join(', ')}</div>
        </a>
      `
    }
    const targetDiv = this.el.nativeElement.querySelector('.list');
    if (targetDiv) {
      this.renderer.setProperty(targetDiv, 'innerHTML', listJsx);
    }
  }
  
  renderDescription(list:Character[]) {
    const renderBooks = (characters:string[]) => {
      let listJsx:string = '';
      for (let [i, item] of characters.entries()) {
        const items = item.split('/')
        listJsx += `
          <a class="description" href="${window.location.origin}/books?id=${items[items.length - 1]}">${window.location.origin}/characters?id=${items[items.length - 1]}</a><br>
        `
        if (i > 10) break;
      }
      return listJsx;
    }

    let listJsx:string = '';
    for (let item of list) {
      listJsx += `
        <h1>${item.name}</h1>
        <span class="title">Gender:</span>
        <span class="description">${item.gender}</span><br>
        <span class="title">Father:</span>
        <span class="description">${item.father}</span><br>
        <span class="title">Mother:</span>
        <span class="description">${item.mother}</span><br>
        <span class="title">Spouse:</span>
        <span class="description">${item.spouse}</span><br>
        <span class="title">Culture:</span>
        <span class="description">${item.culture}</span><br>
        <span class="title">Born:</span>
        <span class="description">${item.born}</span><br>
        <span class="title">Died:</span>
        <span class="description">${item.died}</span><br>
        <span class="title">Titles:</span>
        <span class="description">${item.titles.join(', ')}</span><br>
        <span class="title">Aliases:</span>
        <span class="description">${item.aliases.join(', ')}</span><br>
        <span class="title">Books:</span><br>
        ${renderBooks(item.books)}
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
