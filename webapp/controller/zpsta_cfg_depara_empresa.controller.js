sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/m/MessageToast"
], function (
	BaseController,
	MessageToast
) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.zpsta_cfg_depara_empresa", {
		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact");
			
			this.byId('smartFilterBarDeParEmp-btnGo').setText(this.geti18NText("FILTER_BAR_GO")); 
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
						MessageToast.show("Erro ao inserir registro!");
						that.closeDialog();
						model.refresh();
					}
				}
			};
			oModel.submitChanges(mParameters);
		},

		onDelete: function () {
			var that = this;
			this.approveDialog(function () {
				var tblDados = that.byId("tblDadosDeParEmp").getTable(),
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
				"CodEmpresa": "",
				"Descricao": "",
				"CodCia": ""
			};

			var oModel = this.getOwnerComponent().getModel();
			oModel.setUseBatch(true);
			var oContext = oModel.createEntry("/OZPSTA_CFG_DEPARA_EMP", {
				properties: newItem
			});

			var dialog = this._getDialog("frmDialogDeParEmp", "portoseguro.zpstaparametros.view.dialogs.ZPSTA_CFG_DEPARA_EMPRESADialog");
			sap.ui.core.Fragment.byId("frmDialogDeParEmp", "formDeParEmp").bindElement(oContext.getPath());
			dialog.open();

		},
		onEdit: function (oEvent) {
			var tblDados = this.byId("tblDadosDeParEmp").getTable(),
				selectedIndices = tblDados.getSelectedIndices();

			if (selectedIndices.length === 1) {
				this.bEdit = true;
				var oSelIndex = tblDados.getSelectedIndex();
				var oContext = tblDados.getContextByIndex(oSelIndex);
				var dialog = this._getDialog("frmDialogDeParEmp", "portoseguro.zpstaparametros.view.dialogs.ZPSTA_CFG_DEPARA_EMPRESADialog");
				sap.ui.core.Fragment.byId("frmDialogDeParEmp", "formDeParEmp").bindElement(oContext.getPath());
				dialog.open();
			} else {
				var oBundle = this.getResourceBundle();
				var sMsg = oBundle.getText("msgMultiplosItensEdicao");
				MessageToast.show(sMsg);
			}

		},
		onAdd: function () {
			var that = this;
			var path = sap.ui.core.Fragment.byId("frmDialogDeParEmp", "formDeParEmp").getElementBinding().getPath();
			var model = sap.ui.core.Fragment.byId("frmDialogDeParEmp", "formDeParEmp").getModel();
			var boundItem = model.getProperty(path);
			var tblDados = this.byId("tblDadosDeParEmp").getTable();
			var selectedIndices = tblDados.getSelectedIndices();
			if (selectedIndices.length === 1) {
				this.bEdit = true;
			}
			if (this.bEdit === true) {
				var mParameters = {
					success: function (oData, response) {
						MessageToast.show("Salvo com sucesso!");
					}
				}
				that.closeDialog();
				model.submitChanges(mParameters);
				model.refresh();
			}
			else {
				if (boundItem.CodEmpresa) {
					var bDuplicateKeys = false;
					var aKeys = Object.keys(model.oData);
					var odata = model.oData;
					model.mChangedEntities = {};
					for (var record in odata) {
						if (boundItem.CodEmpresa == odata[record].CodEmpresa) {
							bDuplicateKeys = true;
						}
					}
					if (!bDuplicateKeys) {
						var mParameters = {
							success: function (oData, response) {
								MessageToast.show("Salvo com sucesso!");
								that.closeDialog();
							},
							error: function (oError) {
								that.getView().byId('tblDadosDeParEmp').rebindTable();
							}
						};
						model.submitChanges(mParameters);
						model.refresh();
					} else {
						that.closeDialog();
						MessageToast.show("Item já existente!", {
							duration: 3000
						});
					}
				}
			}
		}
	}
	)
})
