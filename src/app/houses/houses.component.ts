import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { House } from './interface';

@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.css']
})
export class HousesComponent implements OnInit {
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
      const url = `https://www.anapioficeandfire.com/api/houses?name=${name.replace(/ /g, "%20")}`;
      fetch(url)
      .then(res => res.json())
      .then(res => this.renderList(res))
      .catch((err) => console.log(`ERROR: ${err.message}`));
    } else if (this.route.snapshot.queryParams["id"]) {
      const id = this.route.snapshot.queryParams["id"];
      this.updateQueryId(id);
      const url = `https://www.anapioficeandfire.com/api/houses/${id}`;
      fetch(url)
      .then(res => res.json())
      .then(res => this.renderDescription([res]))
      .catch((err) => console.log(`ERROR: ${err.message}`));
    } else {
      const url = "https://www.anapioficeandfire.com/api/houses";
      fetch(url)
      .then(res => res.json())
      .then(res => this.renderList(res))
      .catch((err) => console.log(`ERROR: ${err.message}`));
    }
  }
  
  renderList(list:House[]) {
    let listJsx:string = '';
    for (let item of list) {
      const id = item.url.split('/')
      listJsx += `
        <a class="card" href="${window.location.origin}/houses?id=${id[id.length - 1]}">
          <div class="name">${item.name}</div>
          <div class="description">${item.region}</div>
        </a>
      `
    }
    const targetDiv = this.el.nativeElement.querySelector('.list');
    if (targetDiv) {
      this.renderer.setProperty(targetDiv, 'innerHTML', listJsx);
    }
  }
  
  renderDescription(list:House[]) {
    const renders = (characters:string[], path:string) => {
      let listJsx:string = '';
      for (let [i, item] of characters.entries()) {
        const items = item.split('/')
        listJsx += `
          <a class="description" href="${window.location.origin}/${path}?id=${items[items.length - 1]}">${window.location.origin}/${path}?id=${items[items.length - 1]}</a><br>
        `
        if (i > 10) break;
      }
      return listJsx;
    }

    let listJsx:string = '';
    for (let item of list) {
      const currentLord=`${window.location.origin}/characters?id=${item.currentLord[item.currentLord.length - 1]}`;
      const heir=`${window.location.origin}/characters?id=${item.heir[item.heir.length - 1]}`;
      const overlord=`${window.location.origin}/houses?id=${item.overlord[item.overlord.length - 1]}`;
      const founder=`${window.location.origin}/characters?id=${item.founder[item.founder.length - 1]}`;

      listJsx += `
        <h1>${item.name}</h1>
        <span class="title">Region:</span>
        <span class="description">${item.region}</span><br>
        <span class="title">Coat of arms:</span>
        <span class="description">${item.coatOfArms}</span><br>
        <span class="title">Words:</span>
        <span class="description">${item.words}</span><br>
        <span class="title">Titles:</span>
        <span class="description">${item.titles.join(', ')}</span><br>
        <span class="title">Seats:</span>
        <span class="description">${item.seats.join(', ')}</span><br>
        <span class="title">Founded:</span>
        <span class="description">${item.founded}</span><br>
        <span class="title">Died out:</span>
        <span class="description">${item.diedOut}</span><br>
        <span class="title">Titles:</span>
        <span class="description">${item.titles.join(', ')}</span><br>
        <span class="title">Aliases:</span>
        <span class="description">${item.ancestralWeapons.join(', ')}</span><br>
        <span class="title">Current lord:</span>
        <a class="description" href="${currentLord}">${currentLord}</a><br>
        <span class="title">Heir:</span>
        <a class="description" href="${heir}">${heir}</a><br>
        <span class="title">Overlord:</span>
        <a class="description" href="${overlord}">${overlord}</a><br>
        <span class="title">Founder:</span>
        <a class="description" href="${founder}">${founder}</a><br>
        <span class="title">Cadet branches:</span><br>
        ${renders(item.cadetBranches, 'houses')}
        <span class="description">...</span><br>
        <span class="title">Sworn members:</span><br>
        ${renders(item.swornMembers, 'characters')}
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
