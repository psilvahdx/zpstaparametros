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
			
				var year = oDate.substr(0,4),
				 month = oDate.substr(4,2),
				 day = oDate.substr(6,2),
				 dateString = `${day}/${month}/${year}`;
			
			return dateString;
		},
		
		formatTimeShow: function (oTime) {
			if (oTime === null){ return "";}
			
				var hour = oTime.substr(0,2),
				 minute = oTime.substr(2,2),
				 second = oTime.substr(4,2),
				 timeString = `${hour}:${minute}:${second}`;
			
			return timeString;
		}

		
	};
});