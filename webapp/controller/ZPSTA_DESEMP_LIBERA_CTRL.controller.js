sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/m/MessageToast"
], function (
	BaseController, MessageToast
) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.ZPSTA_DESEMP_LIBERA_CTRL", {

		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact");
			this.bEdit = false;
			this.getRouter().getRoute("desemp_libera_ctrl").attachPatternMatched(this._onObjectMatched, this);

			this.byId('smartFilterBarDesLib-btnGo').setText(this.geti18NText("FILTER_BAR_GO")); 
			//sap.ui.getCore().byId('__text4').setText(this.geti18NText("FILTER_BAR_NO_FILTER"));
		},

		_onObjectMatched: function (oEvent) {

			var smartFilterBar = this.getView().byId("smartFilterBarDesLib");
			smartFilterBar.clear();
			//smartFilterBar.fireSearch();
			//this.onDataReceived();
		},

		onAfterRendering: function () {
			//this.onDataReceived();
		},

		onDelete: function () {
			this.bEdit = false;
			var that = this;
			this.approveDialog(function () {
				var tblDados = that.byId("tblDadosDesLib").getTable(),
					selectedIndices = tblDados.getSelectedIndices();

				if (selectedIndices.length > 0) {

					selectedIndices.forEach(function (selectedIndex) {

						var context = tblDados.getContextByIndex(selectedIndex);
						var oModel = that.getOwnerComponent().getModel();
						oModel.remove(context.getPath());

					});
					
						tblDados.clearSelection();

				} else {
					var oBundle = that.getResourceBundle();
					var sMsg = oBundle.getText("msgNenhumSelecionado");
					MessageToast.show(sMsg);
				}

			});

		},

		onNew: function () {
			var newItem = {
				"Ctrl": null,
				"CtrlValue": null,
				"TipoCalculo": null,
				"EmpHana": null,
				"TipoCalculoAnt": null,
				"EmpHanaAnt": null
			};

			var oModel = this.getOwnerComponent().getModel();
			var oContext = oModel.createEntry("/OZPSTA_DESEMP_LIBERA_CTRL", {
				properties: newItem
			});

			this._oContext = oContext;

			this.bEdit = false;

			var dialog = this._getDialog("DialogDesempLibCtrl","portoseguro.zpstaparametros.view.dialogs.ZPSTA_DESEMP_LIBERA_CTRLDialog");
			sap.ui.core.Fragment.byId("DialogDesempLibCtrl", "frmDialog").bindElement(oContext.getPath());
			dialog.open();

		},

		onEdit: function (oEvent) {
			var tblDados = this.byId("tblDadosDesLib").getTable(),
				selectedIndices = tblDados.getSelectedIndices();

			if (selectedIndices.length === 1) {
				this.bEdit = true;
				var oSelIndex = tblDados.getSelectedIndex();
				var oContext = tblDados.getContextByIndex(oSelIndex);
				var dialog = this._getDialog("DialogDesempLibCtrl","portoseguro.zpstaparametros.view.dialogs.ZPSTA_DESEMP_LIBERA_CTRLDialog");
				sap.ui.core.Fragment.byId("DialogDesempLibCtrl","frmDialog").bindElement(oContext.getPath());
				dialog.open();
			} else {
				var oBundle = this.getResourceBundle();
				var sMsg = oBundle.getText("msgMultiplosItensEdicao");
				MessageToast.show(sMsg);
			}

		},

		onAdd: function () {

			var model = sap.ui.core.Fragment.byId("DialogDesempLibCtrl","frmDialog").getModel();
			var path = sap.ui.core.Fragment.byId("DialogDesempLibCtrl","frmDialog").getElementBinding().getPath();
			var oContextItem = model.getProperty(path);
			/*var boundItem = {
				
				CTRL: sap.ui.core.Fragment.byId("frmDialog", "CTRL").getValue(),
				CTRL_VALUE: sap.ui.core.Fragment.byId("frmDialog", "CTRL_VALUE").getSelectedKey(),
				TIPO_CALCULO: sap.ui.core.Fragment.byId("frmDialog", "TIPO_CALCULO").getSelectedKey(),
            	EMP_HANA: sap.ui.core.Fragment.byId("frmDialog", "EMP_HANA").getSelectedKey(),
            	TIPO_CALCULO_ANT: sap.ui.core.Fragment.byId("frmDialog", "TIPO_CALCULO_ANT").getValue(),
            	EMP_HANA_ANT: sap.ui.core.Fragment.byId("frmDialog", "EMP_HANA_ANT").getValue()

			};*/
			
			var that = this;

			var mParameters = {
				success: function (oData, response) {
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

			if (this.validateFields(oContextItem)) {
					model.submitChanges(mParameters);
					model.refresh();

			} else {
				var oBundle = this.getResourceBundle();
				var sMsg = oBundle.getText("msgCamposObrigatorios");
				MessageToast.show(sMsg);
			}

		},

		validateFields: function (oObj) {
			var bValid = true;

			if (oObj.Ctrl === null || oObj.Ctrl === "") {
				var oCTRL = sap.ui.core.Fragment.byId("frmDialog", "CTRL");
				oCTRL.setValueState("Error");
				bValid = false;
			}
			return bValid;
		},

		onCancel: function (evt) {
			var model = sap.ui.core.Fragment.byId("DialogDesempLibCtrl", "frmDialog").getModel();
			model.deleteCreatedEntry(this._oContext);
			this.closeDialog();
		},
		
		onDataReceived: function () {

			// var oTable = this.byId("tblDados");
			// var i = 0;
			// //var aTemplate = this.getTableErrorColumTemplate();
			// oTable.getTable().getColumns().forEach(function (oLine) {

			// 	var oFieldName = oLine.getId();
			// 	oFieldName = oFieldName.substring(oFieldName.lastIndexOf("-") + 1, oFieldName.length);

			// 	switch (oFieldName) {
			// 	case "codigo_empresa":
			// 	case "valor_margem_limite":
			// 		oLine.setProperty("width", "150px");
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