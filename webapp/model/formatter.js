sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function (DateFormat) {
	"use strict";

	return {

		date: function (oDate) {
			if (oDate === null){ return "";}
			var oDateFormat = DateFormat.getDateTimeInstance({
				pattern: "dd/MM/yyyy"
			});
			return oDateFormat.format(new Date(oDate), true);
		},

		dateTime: function (oDate) {
			if (oDate === null){ return "";}
			var oDateFormat = DateFormat.getDateTimeInstance({
				pattern: "dd/MM/yyyy HH:mm:ss"
			});
			return oDateFormat.format(new Date(oDate));
		},

		formatDateShow: function (oDate) {
			if (oDate == null){ return "";}
			
			var currDay, currMonth, currYear, fullDateStr;
            currDay = ''+oDate.toLocaleString('pt-BR', {day: 'numeric' });
			currDay = parseInt(currDay) + 1 + '';
			currDay.length < 2? currDay = '0' + currDay : 'Hello World'; 
            currMonth = ''+oDate.toLocaleString('pt-BR', {month: 'numeric'});
            currMonth.length < 2? currMonth = '0' + currMonth : 'Hello World'; 
            currYear = ''+oDate.toLocaleString('pt-BR', {year: 'numeric'});
            fullDateStr = `${currDay}/${currMonth}/${currYear}`;

			if(fullDateStr.includes(`32/12/`)){
				currYear = parseInt(currYear);
				currYear = currYear + 1;
				fullDateStr = `01/01/${currYear}`;
			}
			
			return fullDateStr;
		},
		
		formatTimeShow: function (oTime) {
			if (oTime === null || oTime === undefined || oTime == false){ return "";}

				var oHours = ''+Math.floor(oTime.ms/1000/60/60);
				oHours = oHours.length < 2? '0'+oHours : oHours;
				var oMinutes = ''+Math.floor((oTime.ms/1000/60/60 - oHours)*60);
				oMinutes = oMinutes.length < 2? '0'+oMinutes : oMinutes;
				var oSecounds = ''+Math.round(((oTime.ms/1000/60/60 - oHours)*60 - oMinutes)*60);
				oSecounds = oSecounds.length < 2? '0'+oSecounds : oSecounds;
				var timeString = `${oHours}:${oMinutes}:${oSecounds}`;

				// var oDate = new Date(oTime.ms);
				// var oHours = oDate.getHours()+'';
				// oHours = oHours.length < 2? '0'+oHours : oHours;
				// var oMinutes = oDate.getMinutes()+'';
				// oMinutes = oMinutes.length < 2? '0'+oMinutes : oMinutes;
				// var oSecounds = oDate.getSeconds()+'';
				// oSecounds = oSecounds.length < 2? '0'+oSecounds : oSecounds;
				// var timeString = `${oHours}:${oMinutes}:${oSecounds}`;

			return timeString;
		},

		formatDateEdit: function (oDate){
			let currDay = oDate.getDate() + 1;
            let currMonth = oDate.getMonth() + 1;
            let currYear = oDate.getUTCFullYear();

			let mDate = `${currMonth} ${currDay} ${currYear} 00:00:00`;
			if(mDate.includes('12 32')){
				currYear = parseInt(currYear);
				currYear = currYear + 1;
				mDate = `01 01 ${currYear} 00:00:00`;
			}
			return new Date(mDate);
		}

		
	};
});