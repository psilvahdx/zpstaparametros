sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/m/MessageToast"
], function (
	BaseController, MessageToast
) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.ZPSTA_CFG_EMP_EVE", {

		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact");
			//this._getBusyDialog().close();

			this.byId('smartFilterBarEmpEve-btnGo').setText(this.geti18NText("FILTER_BAR_GO")); 
			//sap.ui.getCore().byId('__text4').setText(this.geti18NText("FILTER_BAR_NO_FILTER"));
		},

		onSave: function () {
			var oModel = this.getOwnerComponent().getModel();
            oModel.setUseBatch(true);

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
				var tblDados = that.byId("tblDadosEmpEve").getTable(),
					selectedIndices = tblDados.getSelectedIndices();

				if (selectedIndices.length > 0) {

					selectedIndices.forEach(function (selectedIndex) {

						var context = tblDados.getContextByIndex(selectedIndex);
						var oModel = that.getOwnerComponent().getModel();
                        oModel.setUseBatch(false);
						oModel.remove(context.getPath());

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
				"CodigoEmpresa": null,
				"CodEveNegocio": "",
				"DescEveNegocio": "",
				"Script": "",
				"Table": "",
				"Pivot": 0
			};

			var oModel = this.getOwnerComponent().getModel();
            oModel.setUseBatch(true);
			var oContext = oModel.createEntry("/OZPSTA_CFG_EMP_EVE", {
				properties: newItem
			});
			
				this._oContext = oContext;

			var dialog = this._getDialog("frmDialogEmpEve", "portoseguro.zpstaparametros.view.dialogs.ZPSTA_CFG_EMP_EVEDialog");
			sap.ui.core.Fragment.byId("frmDialogEmpEve", "formEmpEve").bindElement(oContext.getPath());
			dialog.open();
		},

		onAdd: function () {

			var path = sap.ui.core.Fragment.byId("frmDialogEmpEve", "formEmpEve").getElementBinding().getPath();
			var model = sap.ui.core.Fragment.byId("frmDialogEmpEve", "formEmpEve").getModel();
			var boundItem = model.getProperty(path);
			var that = this;
			var mParameters = {
				success: function (oData, response) {
                    console.log(oData);
					MessageToast.show("Salvo com sucesso!");
					// that.closeDialog();
				},
				error: function (oError) {
					// if (oError) {
					// 	if (oError.responseText) {
					// 		var oErrorMessage = JSON.parse(oError.responseText);
					// 		sap.m.MessageBox.alert(oErrorMessage.error.message.value);
					// 		that.closeDialog();
					// 	}
					// }
				}
			};

			model.submitChanges(mParameters);
			model.refresh();
			
		},
		
		onDataReceived: function () {

			// var oTable = this.byId("tblDados");
			// var i = 0;
			// oTable.getTable().getColumns().forEach(function (oLine) {

			// 	var oFieldName = oLine.getId();
			// 	oFieldName = oFieldName.substring(oFieldName.lastIndexOf("-") + 1, oFieldName.length);

			// 	switch (oFieldName) {
			// 	case "codigo_empresa":
			// 	case "codigo_evento_negocio":
			// 	case "script":
			// 		oLine.setProperty("width", "150px");
			// 		break;
			// 	case "pivot":
			// 		oLine.setProperty("width", "80px");
			// 		break;
			// 	default:
			// 		oLine.setProperty("width", "200px");
			// 		break;
			// 	}

			// 	i++;
			// });

		},

		setCbData: async function(cbId){
			// let cBoxGroup = sap.ui.core.Fragment.byId("frmDialogEmpEve", cbId);

			// var arrScript, arrTable;

			// arrScript = this.onGetServData("/OZPSTA_CFG_ORIGENS");
			// arrTable = await this.onGetServData("/OZPSTA_CFG_TABSTG");

			// console.log(arrScript);
			// console.log(arrTable);

			// arrTable = ['PSTA_FPSL_1."zpstaStage.ZPSTA_STG_BT_SIN"', 'PSTA_FPSL_1."zpstaStage.ZPSTA_STG_BT_PRV"', 'PSTA_FPSL_1."zpstaStage.ZPSTA_STG_BT_SOC"',
			// 'PSTA_FPSL_1."zpstaStage.ZPSTA_STG_BT_CPG"', 'PSTA_FPSL_1."zpstaStage.ZPSTA_STG_BT_PRE"', 'PSTA_FPSL_1."zpstaStage.ZPSTA_STG_BT_SGS"',
			// 'PSTA_FPSL_1."zpstaStage.ZPSTA_STG_BT_SIS"', 'PSTA_FPSL_1."zpstaStage.ZPSTA_STG_BT_R_PRE"', 'PSTA_FPSL_1."zpstaStage.ZPSTA_STG_BT_R_SIN"',
			// 'PSTA_FPSL_1."zpstaStage.ZPSTA_STG_BT_R_PSI"', 'PSTA_FPSL_1."zpstaStage.ZPSTA_STG_BT_R_PPR"'];

			// if(cbId === 'script' && arrScript == true){
			// 	for(let i = 0; i < arrScript.length; i++){
			// 		let el = new sap.ui.core.Item({"key": arrScript[i], text: arrScript[i]});
			// 		cBoxGroup.addItem(el);
			// 		i === 0? cBoxGroup.setSelectedKey(arrScript[i]) : 'ignore';
			// 	}
			// }

			// if(cbId === 'table' && arrTable == true){
			// 	for(let i = 0; i < arrTable.length; i++){
			// 		let el = new sap.ui.core.Item({"key": arrTable[i], text: arrTable[i]});
			// 		cBoxGroup.addItem(el);
			// 		i === 0? cBoxGroup.setSelectedKey(arrTable[i]) : 'ignore';
			// 	}
			// }
		}

	});
});