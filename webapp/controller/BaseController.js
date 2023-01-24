sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text",
	"sap/ui/core/Fragment",
	"../model/formatter"
], function (Controller, History, UIComponent, Dialog, DialogType, Button, ButtonType, Text, Fragment,formatter) {
	"use strict";

	return Controller.extend("portoseguro.zpstaparametros.controller.BaseController", {
		
		formatter: formatter,

		_getDialog: function (dialogId,fragmentDialog) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment(dialogId, fragmentDialog, this);
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},

		closeDialog: function () {
			this._getDialog().close();

		},

		_getBusyDialog: function () {
			if (!this._oBusyDialog) {
				this._oBusyDialog = sap.ui.xmlfragment("portoseguro.psta_parametros.view.dialogs.BusyDialog", this);
				this.getView().addDependent(this._oBusyDialog);
			}
			return this._oBusyDialog;
		},

		closeBusyDialog: function () {
			this._getBusyDialog().close();
		},

		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		approveDialog: function (onConfirmar) {
			if (!this.oApproveDialog) {
				this.oApproveDialog = new Dialog({
					type: DialogType.Message,
					title: "Confirmar",
					content: new Text({
						text: "Confirma a exclusão dos registros?"
					}),
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "Confirmar",
						press: function () {
							onConfirmar();
							//this.onProcess();
							this.oApproveDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Cancelar",
						press: function () {
							this.oApproveDialog.close();
						}.bind(this)
					})
				});
			}

			this.oApproveDialog.open();
		},

		onNavBack: function () {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, true /*no history*/ );
			}
			if (this._oDialog) {
				this._oDialog.destroy();
				this._oDialog = undefined;
			}
			
			/*var oModel = this.getOwnerComponent().getModel();
			oModel.refresh();
			***************************
			this.getView().getElementBinding().refresh(true);*/
		},

		onCancel: function (evt) {
			var model = sap.ui.core.Fragment.byId("frmDialog"+evt, "form"+evt).getModel();
			model.deleteCreatedEntry(this._oContext);
			this.closeDialog();
		},

		onDataReceived: function () {

			// var oTable = this.byId("tblDados");
			// var i = 0;
			// oTable.getTable().getColumns().forEach(function (oLine) {
			// 	oLine.setWidth("100%");
			// 	oLine.getParent().autoResizeColumn(i);
			// 	i++;
			// });

			//this.customizeTableColumnLabels(oTable);

		},

		onGetNewDate: function(){
			var currDate = new Date();
			var currDay, currMonth, currYear, currUTCTime, fullDateStr;
            currDay = ''+currDate.toLocaleString('pt-BR', {day: 'numeric' });
            currMonth = ''+currDate.toLocaleString('pt-BR', {month: 'numeric'});
            currMonth.length < 2? currMonth = '0' + currMonth : 'Hello World'; 
            currYear = ''+currDate.toLocaleString('pt-BR', {year: 'numeric'});
            currUTCTime = currDate.toLocaleString('pt-BR', {hour: 'numeric', minute: 'numeric', second: 'numeric'});
            fullDateStr = `${currYear}-${currMonth}-${currDay} ${currUTCTime}.000000000`;

			return fullDateStr;
		},

		onGetServData : function (sPath) {
			// var oModel = this.getView().getModel();
			// // var that = this; 
			// var arrData;
			// oModel.read(sPath, {
			// 	success: function (oData) {
			// 		// for(let i = 0; i < oData.results.length; i++){
			// 		// 	arrData.push(oData.results[i].Script);
			// 		// }
			// 		arrData = oData.results;
			// 		console.log(arrData);
			// 		return arrData;
			// 	},
		
			// 	error: function (oError) {
			// 		console.log(oError);
			// 	}
			// });
		},

		geti18NResourceBundle: function() {
			if (this.getView()) {
				// return this.getView().getModel("i18n").getResourceBundle();
				return this.getOwnerComponent().getModel('i18n').getResourceBundle();
			} else {
				return null;
			}
		},
	
		geti18NText: function(key) {
			if (this.geti18NResourceBundle()) {
				return this.geti18NResourceBundle().getText(key);
			} else {
				return null;
			}
		}	

	});

});