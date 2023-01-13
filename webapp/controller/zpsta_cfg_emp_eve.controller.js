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
				"Pivot": null
			};

			var oModel = this.getOwnerComponent().getModel();
            oModel.setUseBatch(true);
			var oContext = oModel.createEntry("/OZPSTA_CFG_EMP_EVE", {
				properties: newItem
			});
			
				this._oContext = oContext;

			var dialog = this._getDialog("portoseguro.zpstaparametros.view.dialogs.ZPSTA_CFG_EMP_EVEDialog");
			sap.ui.core.Fragment.byId("frmDialog", "formEmpEve").bindElement(oContext.getPath());
			dialog.open();

		},

		onAdd: function () {

			var path = sap.ui.core.Fragment.byId("frmDialog", "formEmpEve").getElementBinding().getPath();
			var model = sap.ui.core.Fragment.byId("frmDialog", "formEmpEve").getModel();
			var boundItem = model.getProperty(path);
			var that = this;
			var mParameters = {
				success: function (oData, response) {
                    console.log(oData);
					MessageToast.show("Salvo com sucesso!");
					that.closeDialog();
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

		}

	});
});