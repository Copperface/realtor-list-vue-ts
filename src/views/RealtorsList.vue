<template>
  <v-card>
    <v-card-title>
      <v-container fluid grid-list-lg>
        <v-layout row wrap justify-end>
          <v-flex xs12 lg2>
            <v-menu
              v-model="showSinceDate"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="formatedSinceDate"
                  label="Дата регистрации с:"
                  @click:append="handleClickClearSinceDate"
                  v-on="on"
                  readonly
                  :append-icon="formatedSinceDate && 'close'"
                ></v-text-field>
              </template>
              <v-date-picker locale="ru-RU" v-model="sinceDate" no-title></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12 lg2>
            <v-menu
              v-model="showTillDate"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="formatedTillDate"
                  label="Дата регистрации по:"
                  @click:append="handleClickClearTillDate"
                  v-on="on"
                  readonly
                  :append-icon="formatedTillDate && 'close'"
                ></v-text-field>
              </template>
              <v-date-picker locale="ru-RU" v-model="tillDate" no-title></v-date-picker>
            </v-menu>
          </v-flex>

          <v-flex xs12 lg2>
            <v-text-field
              v-model="surnameFilter"
              append-icon="search"
              label="Поиск по фамилии"
              @click:append="handleAppendSurnameFilter"
              @keyup.enter="handleAppendSurnameFilter"
              @click:clear="handleClearSurnameFilter"
              single-line
              hide-details
              clearable
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-title>
    <v-data-table
      v-model="realtorsData"
      :headers="TABLE_HEADERS"
      :items="realtorsData"
      :item-key="'guid'"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td
          @dblclick="() => handleDBLClickTableRow(props.item.id)"
          class="text-xs-right"
        >{{ props.item.surname }}</td>
        <td
          @dblclick="() => handleDBLClickTableRow(props.item.id)"
          class="text-xs-right"
        >{{ props.item.name }}</td>
        <td
          @dblclick="() => handleDBLClickTableRow(props.item.id)"
          class="text-xs-right"
        >{{ props.item.unit.name }}</td>
        <td
          @dblclick="() => handleDBLClickTableRow(props.item.id)"
          class="text-xs-right"
        >{{ props.item.register_date }}</td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import moment from 'moment';
import db from '@/db';

import RealtorData from '@/models/RealtorData';
import UnitData from '@/models/UnitData';
import FullRealtorData from '@/models/FullRealtorData';

@Component({
  props: {
    query: Object,
  },
})
export default class RealtorsList extends Vue {

  get formatedSinceDate(): string {
    return this.sinceDate ? moment(this.sinceDate).format('DD.MM.YYYY') : '';
  }

  get formatedTillDate(): string {
    return this.tillDate ? moment(this.tillDate).format('DD.MM.YYYY') : '';
  }
  public readonly TABLE_HEADERS = [
    { text: 'Фамилия', value: 'surname', align: 'center' },
    { text: 'Имя', value: 'name', align: 'center' },
    { text: 'Подразделение', value: 'uid', align: 'center' },
    { text: 'Дата регистрации', value: 'register_date', align: 'center' },
  ];

  public realtorsData: FullRealtorData[] = [];

  public surnameFilter: string = this.query.surname || '';

  // Date since filter
  public showSinceDate: boolean = false;
  public sinceDate: string =
    this.query.date_since &&
    moment(this.query.date_since, 'DD.MM.YYYY').isValid()
      ? moment(this.query.date_since, 'DD.MM.YYYY').format('YYYY-MM-DD')
      : '';

  // Date till filter
  public showTillDate: boolean = false;
  public tillDate: string =
    this.query.date_till && moment(this.query.date_till, 'DD.MM.YYYY').isValid()
      ? moment(this.query.date_till, 'DD.MM.YYYY').format('YYYY-MM-DD')
      : '';

  public handleClickClearSinceDate(): void {
    this.sinceDate = '';
  }

  @Watch('formatedSinceDate')
  public onFormatedSinceDateChange(): void {
    this.$router.push({
      path: '/',
      query: { ...this.query, date_since: this.formatedSinceDate },
    });
  }

  public handleClickClearTillDate(): void {
    this.tillDate = '';
  }

  @Watch('formatedTillDate')
  public onFormatedTillDateChange(): void {
    this.$router.push({
      path: '/',
      query: { ...this.query, date_till: this.formatedTillDate },
    });
  }

  @Watch('query')
  public onQueryChanged(): void {
    this.initComponent();
  }

  public mounted(): void {
    this.initComponent();
  }

  public initComponent(): void {
    this.getData().then((data) => {
      this.realtorsData = this.filterData(data, this.query);
    });
  }

  public getData(): Promise<FullRealtorData[]> {
    return new Promise((resolve, reject) => {
      Promise.all([this.getUnits(), this.getRealtors()]).then(
        ([units, realtors]) => {
          resolve(
            realtors.map((realtor) => {
              return {
                ...realtor,
                unit: units.find((unit) => unit.id === realtor.uid) || {
                  id: 0,
                  name: '',
                  register_date: '',
                },
              };
            }),
          );
        },
      );
    });
  }

  public getUnits(): Promise<UnitData[]> {
    return new Promise((resolve) => {
      db.ref('Units').on('value', (snapshot) => {
        resolve(snapshot.val());
      });
    });
  }

  public getRealtors(): Promise<RealtorData[]> {
    return new Promise((resolve) => {
      db.ref('Realtors').on('value', (snapshot) => {
        resolve(snapshot.val());
      });
    });
  }

  public filterData(data: FullRealtorData[], query: any): FullRealtorData[] {
    let dataCopy: FullRealtorData[] = [...data];
    dataCopy = this.clearUndefined(dataCopy);
    query.surname && (dataCopy = this.filterBySurname(dataCopy, query.surname));

    query.date_since &&
      moment(query.date_since, 'DD.MM.YYYY').isValid() &&
      (dataCopy = this.filterByDateSince(dataCopy, query.date_since));

    query.date_till &&
      moment(query.date_till, 'DD.MM.YYYY').isValid() &&
      (dataCopy = this.filterByDateTill(dataCopy, query.date_till));

    query.search && (dataCopy = this.filterBySearch(dataCopy, query.search));

    return dataCopy;
  }
  public clearUndefined(data: FullRealtorData[]): FullRealtorData[] {
    return data.filter((el: FullRealtorData) => {
      return el;
    });
  }

  public filterBySearch(
    data: FullRealtorData[],
    search: string,
  ): FullRealtorData[] {
    return data.filter((el: FullRealtorData) => {
      return (
        el.surname.toLowerCase().includes(search.toLowerCase()) ||
        el.name.toLowerCase().includes(search.toLowerCase()) ||
        el.unit.name.toLowerCase().includes(search.toLowerCase())
      );
    });
  }

  public filterBySurname(
    data: FullRealtorData[],
    surname: string,
  ): FullRealtorData[] {
    return data.filter((el: FullRealtorData) => {
      return el.surname.toLowerCase().includes(surname.toLowerCase());
    });
  }

  public filterByDateSince(
    data: FullRealtorData[],
    dateSince: string,
  ): FullRealtorData[] {
    return data.filter((el: FullRealtorData) => {
      return (
        moment(el.register_date, 'DD.MM.YYYY') >=
        moment(dateSince, 'DD.MM.YYYY')
      );
    });
  }

  public filterByDateTill(
    data: FullRealtorData[],
    dateTill: string,
  ): FullRealtorData[] {
    return data.filter((el: FullRealtorData) => {
      return (
        moment(el.register_date, 'DD.MM.YYYY') <= moment(dateTill, 'DD.MM.YYYY')
      );
    });
  }

  public handleAppendSurnameFilter(): void {
    this.surnameFilter &&
      this.$router.push({
        path: '/',
        query: { ...this.query, surname: this.surnameFilter },
      });
    this.query.surname &&
      !this.surnameFilter &&
      this.handleClearSurnameFilter();
  }

  public handleClearSurnameFilter(): void {
    this.$router.push({
      path: '/',
      query: { ...this.query, surname: '' },
    });
  }

  public handleDBLClickTableRow(id: number): void {
    this.$router.push({
      path: '/card/edit/' + id,
    });
  }
}
</script>
