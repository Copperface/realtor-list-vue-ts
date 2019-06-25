<template>
  <v-form v-model="formValid" ref="form" lazy-validation>
    <v-text-field
      v-model="realtor.surname"
      :rules="[RULES.required, RULES.name, RULES.counter]"
      label="Фамилия"
    />
    <v-text-field
      v-model="realtor.name"
      :rules="[RULES.required, RULES.name, RULES.counter]"
      label="Имя"
    />
    <v-select
      v-model="selectedUnit"
      item-text="name"
      return-object
      :items="units"
      label="Подразделение"
      required
    />
    <v-menu
      v-model="showDatePicker"
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
          v-model="formatedRegisterDate"
          label="Дата регистрации"
          v-on="on"
          readonly
          required
        ></v-text-field>
      </template>
      <v-date-picker locale="ru-RU" v-model="registerDate" no-title></v-date-picker>
    </v-menu>
    <v-btn @click="handleClickSaveData" :disabled="!formValid" color="green">Сохранить</v-btn>
    <v-btn v-if="isEdit" @click="handleClickDeleteUser" color="red">Удалить</v-btn>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { uuid } from "vue-uuid";

import db from "@/db";
import moment from "moment";

import UnitData from "@/models/UnitData";
import RealtorData from "@/models/RealtorData";

@Component({
  props: {
    id: String,
    method: String
  }
})
export default class RealtorCard extends Vue {
  public readonly RULES = {
    required: (value: string): any =>
      !!value || "Значение не может быть пустым.",
    counter: (value: string): any =>
      value.length <= 20 || "Не более 20 символов",
    name: (value: string): any => {
      const pattern = /^[А-ЯA-Z][а-яёa-z]+$/;
      return (
        pattern.test(value) ||
        "Должно содержать русские или латинские и начинаться с заглавной"
      );
    }
  };

  public units: UnitData[] = [];
  public realtor: RealtorData = {
    id: 0,
    guid: "",
    name: "",
    surname: "",
    register_date: "",
    uid: 0
  };
  public selectedUnit: UnitData = { id: 0, name: "", register_date: "" };
  public formValid: boolean = true;

  public showDatePicker: boolean = false;
  public registerDate: string = "";
  get formatedRegisterDate(): string {
    return this.registerDate
      ? moment(this.registerDate).format("DD.MM.YYYY")
      : "";
  }

  @Watch("formatedRegisterDate")
  public onFormatedRegisterDateChange(): void {
    this.realtor = {
      ...this.realtor,
      register_date: this.formatedRegisterDate
    };
  }

  @Watch("selectedUnit")
  public onSelectedUnitChange(): void {
    this.realtor = { ...this.realtor, uid: this.selectedUnit.id };
  }

  @Watch("query")
  public onQueryChanged(): void {
    this.isEdit && this.initComponentEdit();
  }

  get isEdit(): boolean {
    return this.method === "edit";
  }

  get isCreate(): boolean {
    return this.method === "create";
  }

  public mounted(): void {
    this.isEdit && this.initComponentEdit();
    this.isCreate && this.initComponentCreate();
  }

  public initComponentEdit(): void {
    Promise.all([this.getUnits(), this.getRealtor()]).then(
      ([units, realtor]) => {
        this.units = units;
        this.realtor = realtor;

        this.selectedUnit = this.units.find(
          el => el.id == this.realtor.uid
        ) || { id: 0, name: "", register_date: "" };

        this.registerDate = moment(
          this.realtor.register_date,
          "DD.MM.YYYY"
        ).format("YYYY-MM-DD");
      }
    );
  }

  public initComponentCreate(): void {
    this.getUnits().then(units => {
      this.units = units;
    });
    this.setNextID();
    this.realtor = this.generateGUID(this.realtor);
  }

  public getUnits(): Promise<UnitData[]> {
    return new Promise(resolve => {
      db.ref("Units").on("value", snapshot => {
        resolve(snapshot.val());
      });
    });
  }

  public getRealtor(): Promise<RealtorData> {
    return new Promise(resolve => {
      db.ref("Realtors/" + this.id).on("value", snapshot => {
        resolve(snapshot.val());
      });
    });
  }

  public setNextID(): void {
    db.ref("Realtors")
      .orderByChild("id")
      .limitToLast(1)
      .once("value", snapshot => {
        this.realtor = {
          ...this.realtor,
          id: +Object.keys(snapshot.val())[0] + 1
        };
      });
  }

  public generateGUID(data: RealtorData): RealtorData {
    return {
      ...data,
      guid: uuid.v1()
    };
  }

  public updateUserData(data: RealtorData): void {
    db.ref("Realtors/" + this.id).update(this.realtor, () => {
      this.$router.push({ path: "/" });
    });
  }

  public createUser(data: RealtorData): void {
    db.ref("Realtors/" + data.id).set(this.realtor, () => {
      this.$router.push({ path: "/" });
    });
  }

  public deleteUser(id: string): void {
    db.ref("Realtors/" + this.id).remove(() => {
      this.$router.push({ path: "/" });
    });
  }

  public handleClickSaveData(): void {
    if (this.$refs.form.validate()) {
      this.isEdit && this.updateUserData(this.realtor);
      this.isCreate && this.createUser(this.realtor);
    }
  }

  public handleClickDeleteUser(): void {
    const confirm = window.confirm("Вы действительно хотите удалить?");
    confirm && this.deleteUser(this.id);
  }
}
</script>
