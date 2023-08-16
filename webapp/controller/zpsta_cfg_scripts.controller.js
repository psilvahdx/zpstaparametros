sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (
	BaseController, MessageToast, Filter, FilterOperator
) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.ZPSTA_CFG_SCRIPTS", {

		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact");

			this.byId('smartFilterBarCfgSct-btnGo').setText(this.geti18NText("FILTER_BAR_GO")); 
			sap.ui.getCore().byId('__text4').setText(this.geti18NText("FILTER_BAR_NO_FILTER"));

			// const _nOrigens = [];
			// const _nFields = []; 

			// this.onVerifyValue(_nOrigens, "/OZPSTA_CFG_ORIGENS", "Script");
			// this.onVerifyValue(_nFields, "/OZPSTA_SCRIPT_FIELDS", "ColumnName");

			// console.log(_nOrigens);
			// console.log(_nFields);
		},

		onSave: function () {
			var oModel = this.getOwnerComponent().getModel();

			var mParameters = {
				sucess: function (oData, response) {
					MessageToast.show("Salvo com sucesso!");
				},
				error: function (oError) {
					if (oError) {
						if (oError.responseText) {
							var oErrorMessage = JSON.parse(oError.responseText);
							sap.m.MessageBox.alert(oErrorMessage.error.message.value);
						}
					}
				}
			};

			oModel.submitChanges(mParameters);
		},

		onDelete: function () {
			var that = this;
			this.approveDialog(function () {
				var tblDados = that.byId("tblDadosCfgSct").getTable(),
					selectedIndices = tblDados.getSelectedIndices();

				if (selectedIndices.length > 0) {

					selectedIndices.forEach(function (selectedIndex) {

						var context = tblDados.getContextByIndex(selectedIndex);
						var oModel = that.getOwnerComponent().getModel();
						oModel.remove(context.getPath());
						oModel.setUseBatch(false);

					});

				} else {
					var oBundle = this.getResourceBundle();
					var sMsg = oBundle.getText("msgNenhumSelecionado");
					MessageToast.show(sMsg);
				}

			});

		},


		onNew: function () {
			var newItem = {
				"Script": "",
				"Field": "",
				"TtField": "",
				"ScriptTechnicalName": "",
				"IDSEC": 0
			};

			var oModel = this.getOwnerComponent().getModel();
			oModel.setUseBatch(true);
			var oContext = oModel.createEntry("/OZPSTA_CFG_SCRIPTS", {
				properties: newItem
			});

			var dialog = this._getDialog("frmDialogCfgSct", "portoseguro.zpstaparametros.view.dialogs.ZPSTA_CFG_SCRIPTSDialog");
			sap.ui.core.Fragment.byId("frmDialogCfgSct", "formCfgSct").bindElement(oContext.getPath());
			dialog.open();

		},

		onAdd: function () {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();

			var path = sap.ui.core.Fragment.byId("frmDialogCfgSct", "formCfgSct").getElementBinding().getPath();
			var model = sap.ui.core.Fragment.byId("frmDialogCfgSct", "formCfgSct").getModel();
			var boundItem = model.getProperty(path);
			var that = this;
			var mParameters = {
				success: function (oData, response) {
					// console.log(oData);
					var stsCode;
					var codeMsg;
					that.closeDialog();
					if(oData.__batchResponses[0].response){
						stsCode = oData.__batchResponses[0].response.statusCode;
						codeMsg = oData.__batchResponses[0].response.body;
						codeMsg = JSON.parse(codeMsg);

						if(stsCode === '200' || stsCode === '201' || stsCode === '202'){
							MessageToast.show("Salvo com sucesso!");
							model.refresh();
						}else{
							sap.m.MessageBox.alert(codeMsg.error.message.value);
							model.refresh();
							model.resetChanges();
						}
					} else if(oData.__batchResponses[0].__changeResponses){
						stsCode = oData.__batchResponses[0].__changeResponses[0].statusCode;

						if(stsCode === '200' || stsCode === '201' || stsCode === '202'){
							MessageToast.show("Salvo com sucesso!");
							model.refresh();
						}else{
							sap.m.MessageBox.alert('Erro ao salvar!');
							model.refresh();
							model.resetChanges();
						}
					}
					
				},
				error: function (oError) {
					if (oError) {
						if (oError.responseText) {
							var oErrorMessage = JSON.parse(oError.responseText);
							sap.m.MessageBox.alert(oErrorMessage.error.message.value);
							that.closeDialog();
						}
					}
				}
			};

			model.submitChanges(mParameters);
			model.refresh();
			// var bodyContent = {
			// 	Script: sap.ui.core.Fragment.byId("frmDialogCfgSct", "script").mProperties.selectedKey,
			// 	Field: sap.ui.core.Fragment.byId("frmDialogCfgSct", "field").mProperties.selectedKey,
			// 	TtField: sap.ui.core.Fragment.byId("frmDialogCfgSct", "ttField0").mProperties.selectedKey,
			// 	ScriptTechnicalName: "ScriptCompareFieldDinamicGeneric"
			// }

			// this.onValItems(bodyContent);
			
			// var oBundle = this.getResourceBundle();
			// var sMsg = oBundle.getText("Registro inserido com sucesso!");

			// oModel.create("/OZPSTA_CFG_SCRIPTS", bodyContent, {
			// 	success: function (oData, response) {
			// 		console.log(oData);
			// 		that.closeDialog();
			// 		oModel.refresh();
			// 		MessageToast.show(sMsg);
			// 		that.onDialogRefresh();
			// 	},
			// 	error: function (oError) {
			// 		if (oError) {
			// 			if (oError.responseText) {
			// 				var oErrorMessage = JSON.parse(oError.responseText);
			// 				sap.m.MessageBox.alert(oErrorMessage.error.message.value);
			// 				that.closeDialog();
			// 			}
			// 		}
			// 	}
			// });
		},
		
		onDataReceived: function () {

			// var oTable = this.byId("tblDadosCfgSct");
			// oTable.getTable().getColumns().forEach(function (oLine) {
			// 	oLine.setProperty("width", "200px");
			// });

		},

		handleChange: function (cbId){
			var elId = cbId;
			var oVerify = 0;
			var aFilters = [];

			if(elId === 'script'){
				var elField = sap.ui.core.Fragment.byId("frmDialogCfgSct", "field");
				var eScript = sap.ui.core.Fragment.byId("frmDialogCfgSct", "script");
				// this.valicaoCb("/OZPSTA_CFG_ORIGENS", "Script");
				aFilters.push(new Filter('Script', FilterOperator.EQ, eScript.getSelectedKey()));
				elField.getBinding('items').filter(aFilters);
				elField.setVisible(true);
			}else if(elId === 'field'){
				var elTtField = sap.ui.core.Fragment.byId("frmDialogCfgSct", "ttField");
				elTtField.setVisible(true);
			}else if(elId === 'add'){
				var elBtn = sap.ui.core.Fragment.byId("frmDialogCfgSct", "btnAdd");
				elBtn.setEnabled(true);
			}

		},

		onVerifyValue: function(oParam, oEntity, oRefer){
			var nParam = oParam;
			var nEntity = oEntity;
			var oModel = this.getOwnerComponent().getModel();

			// for (var i = 0; i < elTtb.getEnabledItems().length; i++) {
			// 	var nTtfil = elTtb.getEnabledItems()[i].mProperties.text;
			// 	oParam.push(nTtfil);

			// }
			// oModel.read(nEntity, {
				// urlParameters: {
				//     "$filter": "Script eq" + "'" + nParam + "'"
				// },
			// 	success: async function (oData) {
			// 		if(oData != null){
			// 			var resultVal;
			// 			for (var i = 0; i < oData.results.length; i++) {
			// 				var oRow = oData.results[i];
			// 				if(oRefer === 'Script'){
			// 					oParam.push(oRow.Script);
			// 					// oRow.Script === oParam ? resultVal = 1 : 'Hello World';
			// 				}

			// 				if(oRefer === 'ColumnName'){
			// 					oParam.push(oRow.ColumnName);
			// 				}
			// 				// for (var key in oRow) {
			// 				//     if (key.includes(oRefer)) {
			// 				//         oRow[key] === oParam ? resultVal = 1 : 'Hello World';
			// 				//     }
			// 				// }
			// 			}
			// 		}
			// 	},
			// 	error: function (oError) {
			// 		console.log(oError);
			// 	}
			// });
		},

		onDialogRefresh: function(){
				var oScript = sap.ui.core.Fragment.byId("frmDialogCfgSct", "script").mProperties.selectedKey;
				var elTab = sap.ui.core.Fragment.byId("frmDialogCfgSct", "field");
				var elTtb = sap.ui.core.Fragment.byId("frmDialogCfgSct", "ttField0");
				var elBtn = sap.ui.core.Fragment.byId("frmDialogCfgSct", "btnAdd");

				oScript.setSelectedKey(null);
				elTab.setSelectedKey(null);
				elTtb.setSelectedKey(null);

				elTab.setVisible(false);
				elTtb.setVisible(false);
				elBtn.setEnabled(false);
		},

		onValItems: function(oObject){
			var oScript = sap.ui.core.Fragment.byId("frmDialogCfgSct", "script");
			var elTab = sap.ui.core.Fragment.byId("frmDialogCfgSct", "field");
			var elTtb = sap.ui.core.Fragment.byId("frmDialogCfgSct", "ttField0");
			var elBtn = sap.ui.core.Fragment.byId("frmDialogCfgSct", "btnAdd");
			
			var oBundle = this.getResourceBundle();
			var sMsg = oBundle.getText("Valor inválido! Verifique e preecha o campo corretamente!");

			if (oObject.Script != false){
				// Validação da Origem contábil
				_nOrigens.includes(oObject.Script) ? oScript.setValueState("Success") : oScript.setValueState("Error");
			}
			else{
				// Mensagem de erro solicitando preenchimento dos campos
				MessageToast.show(sMsg);
			}
		}

		// valicaoCb: function(oParam, oRefer){
		// 	oModel.read(nEntity, {
		// 		urlParameters: {
		// 		    "$filter": "Script eq" + "'" + nParam + "'"
		// 		},
		// 		success: async function (oData) {
		// 			if(oData != null){
		// 				var resultVal;
		// 				for (var i = 0; i < oData.results.length; i++) {
		// 					var oRow = oData.results[i];
		// 					for (var key in oRow) {
		// 					    if (key.includes(oRefer)) {
		// 					        oRow[key] === oParam ? resultVal = 1 : 'Hello World';
		// 					    }
		// 					}
		// 				}
		// 			}
		// 		},
		// 		error: function (oError) {
		// 			console.log(oError);
		// 		}
		// 	});
		// }

	});
});