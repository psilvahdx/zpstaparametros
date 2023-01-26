sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/m/MessageToast"
], function (
	BaseController, MessageToast
) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.ZPSTA_CFG_SCRIPTS", {

		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact");

			this.byId('smartFilterBarCfgSct-btnGo').setText(this.geti18NText("FILTER_BAR_GO")); 
			sap.ui.getCore().byId('__text4').setText(this.geti18NText("FILTER_BAR_NO_FILTER"));
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
				"ScriptTechnicalName": ""
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
			var path = sap.ui.core.Fragment.byId("frmDialogCfgSct", "formCfgSct").getElementBinding().getPath();
			var model = sap.ui.core.Fragment.byId("frmDialogCfgSct", "formCfgSct").getModel();
			var boundItem = model.getProperty(path);
			var that = this;
			var mParameters = {
				success: function (oData, response) {
					console.log(oData);
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

			// var oTable = this.byId("tblDadosCfgSct");
			// oTable.getTable().getColumns().forEach(function (oLine) {
			// 	oLine.setProperty("width", "200px");
			// });

		}

	});
});