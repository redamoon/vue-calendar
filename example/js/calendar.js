new Vue({
  el: '#app',
  data: {
    weeks: ['日', '月', '火', '水', '木', '金', '土'],
    calData: {year: 0, month: 0},
    entriesData: [],
    entriesCount: '',
    entriesDatePublished: []
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
      var monthName = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
      return monthName[month - 1];
    },
    moveLastMonth: function() {
      if (this.calData.month === 1) {
        this.calData.year--;
        this.calData.month = 12;
      } else {
        this.calData.month--;
      }
    },
    moveNextMonth: function() {
      if (this.calData.month === 12) {
        this.calData.year++;
        this.calData.month = 1;
      } else {
        this.calData.month++;
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
      var thisYearMonth = this.calData.year + '.' + this.toDoubleDigits(this.calData.month) + '.';
      var firstDay = new Date(this.calData.year, this.calData.month - 1, 1).getDay();
      var lastDate = new Date(this.calData.year, this.calData.month, 0).getDate();
      var dayIdx = 1;
      var calendar = [];
      for (var w = 0; w < 6; w++) {
        var week = [];
        if (lastDate < dayIdx) {break;}
        for (var d = 0; d < 7; d++) {
          if (w === 0 && d < firstDay) {
            week[d] = {day: ''};
          } else if (w === 6 && lastDate < day) {
            week[d] = {day: ''};
            dayIdx++;
          } else if (lastDate < dayIdx) {
            week[d] = {day: ''};
            dayIdx++;
          } else {
            var thisCalDate = thisYearMonth + this.toDoubleDigits(dayIdx);
            week[d] = {
              day: dayIdx,
              check: '',
              url: ''
            };
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
