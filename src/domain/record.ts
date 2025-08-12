export class Record {
  id: string;
  title: string;
  time: string;
  remark: string;

  constructor(id: string, title: string, time: string, remark: string) {
    this.id = id;
    this.title = title;
    this.time = time;
    this.remark = remark;
  }
}
