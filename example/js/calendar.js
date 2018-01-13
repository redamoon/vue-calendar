new Vue({
  el: '#app',
  data: {
    weeks: ['月', '火', '水', '木', '金', '土', '日'],
    monthName: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    calData: {
      year: 0,
      month: 0
    },
    thisMonth: new Date().getMonth() + 1,
    entriesData: [],
    entriesCount: '',
    entriesDatePublished: [],
    prevStatus: true,
    nextStatus: true
  },
  created: function (){
    var date = new Date();
    this.calData.year = date.getFullYear();
    this.calData.month = date.getMonth() + 1;
    this.getEntries();
  },
  methods: {
    getEntries: function() {
      // Axiosで取得
      var entriesDataPath = '/vue-calendar/example/data/entries_data.json';
      var self = this;
      axios.get(entriesDataPath)
        .then(function (response) {
          self.entriesData = response.data;
          self.entriesCount = response.data.itemData.length;
          for(var i = 0; i < self.entriesCount; i++){
            self.entriesDatePublished.push(self.entriesData.itemData[i].published);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getMonthName: function(month) {
      return this.monthName[month - 1];
    },
    moveLastMonth: function() {
      if (this.calData.month === 1) {
        this.calData.year--;
        this.calData.month = 12;
      } else {
        this.calData.month--;
      }
      if (this.thisMonth !== this.calData.month) {
        this.prevStatus = false;
        this.nextStatus = true;
      } else {
        this.prevStatus = true;
        this.nextStatus = true;
      }
    },
    moveNextMonth: function() {
      if (this.calData.month === 12) {
        this.calData.year++;
        this.calData.month = 1;
      } else {
        this.calData.month++;
      }
      if (this.thisMonth !== this.calData.month) {
        this.prevStatus = true;
        this.nextStatus = false;
      } else {
        this.prevStatus = true;
        this.nextStatus = true;
      }
    },
    toDoubleDigits: function(num) {
      num += '';
      if (num.length === 1) {
        num = '0' + num;
      }
      return num;
    }
  },
  computed: {
    calendar: function() {
      var self = this;
      var thisCalDate;
      var dayIdx = 1;
      var thisYearMonth = this.calData.year + '.' + this.toDoubleDigits(this.calData.month) + '.';
      var firstDay = new Date(this.calData.year, this.calData.month - 1, 0).getDay();
      var lastDate = new Date(this.calData.year, this.calData.month, 0).getDate();
      var calendar = [];
      for (var w = 0; w < 6; w++) {
        var week = [];
        if (lastDate < dayIdx) {break;}
        for (var d = 0; d < 7; d++) {
          if (w === 0 && d < firstDay) {
            week[d] = {day: ''};
          } else if (w === 6 && lastDate < dayIdx) {
            week[d] = {day: ''};
            dayIdx++;
          } else if (lastDate < dayIdx) {
            week[d] = {day: ''};
            dayIdx++;
          } else {
            week[d] = {
              day: dayIdx,
              check: '',
              url: ''
            };
            thisCalDate = thisYearMonth + this.toDoubleDigits(dayIdx);
            for(var i = 0; i < this.entriesDatePublished.length; i++) {
              if(thisCalDate === this.entriesDatePublished[i]){
                week[d].check = true;
                week[d].url = this.entriesDatePublished[i].replace(/^/, '\/').replace(/\./g, '') + '.html';
              }
            }
            dayIdx++;
          }
        }
        calendar.push(week);
      }
      return calendar;
    }
  }
});
