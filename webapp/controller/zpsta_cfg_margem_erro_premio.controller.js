sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/m/MessageToast"
], function (
	BaseController, MessageToast
) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.ZPSTA_CFG_MARGEM_ERRO_PREMIO", {

		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact");
			this.bEdit = false;
			this.getRouter().getRoute("margem_limite_premio").attachPatternMatched(this._onObjectMatched, this);

		},

		_onObjectMatched: function (oEvent) {

			var smartFilterBar = this.getView().byId("smartFilterBarMargErrPrem");
			smartFilterBar.clear();
			smartFilterBar.fireSearch();
			this.onDataReceived();
		},

		onAfterRendering: function () {
			//this.onDataReceived();
		},

		onDelete: function () {
			this.bEdit = false;
			var that = this;
			this.approveDialog(function () {
				var tblDados = that.byId("tblDadosMargErrPrem").getTable(),
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
				"client": 400,
				"codigo_empresa": null,
				"valor_margem_limite": 0
			};

			var oModel = this.getOwnerComponent().getModel();
			var oContext = oModel.createEntry("/OZPSTA_CFG_MARGEM_ERRO_PREMIO", {
				properties: newItem
			});

			this._oContext = oContext;

			this.bEdit = false;

			var dialog = this._getDialog("frmDialogMargErrPrem","portoseguro.psta_parametros.view.dialogs.ZPSTA_CFG_MARGEM_ERRO_PREMIODialog");
			sap.ui.core.Fragment.byId("frmDialogMargErrPrem", "formMargErrPrem").bindElement(oContext.getPath());
			dialog.open();

		},

		onEdit: function (oEvent) {
			var tblDados = this.byId("tblDadosMargErrPrem").getTable(),
				selectedIndices = tblDados.getSelectedIndices();

			if (selectedIndices.length === 1) {
				this.bEdit = true;
				var oSelIndex = tblDados.getSelectedIndex();
				var oContext = tblDados.getContextByIndex(oSelIndex);
				var dialog = this._getDialog("frmDialogMargErrPrem", "portoseguro.psta_parametros.view.dialogs.ZPSTA_CFG_MARGEM_ERRO_PREMIODialog");
				sap.ui.core.Fragment.byId("frmDialogMargErrPrem", "formMargErrPrem").bindElement(oContext.getPath());
				dialog.open();
			} else {
				var oBundle = this.getResourceBundle();
				var sMsg = oBundle.getText("msgMultiplosItensEdicao");
				MessageToast.show(sMsg);
			}

		},

		onAdd: function () {

			var model = sap.ui.core.Fragment.byId("frmDialogMargErrPrem", "formMargErrPrem").getModel();
			var path = sap.ui.core.Fragment.byId("frmDialogMargErrPrem", "formMargErrPrem").getElementBinding().getPath();
			var oContextItem = model.getProperty(path);
			var boundItem = {
				
				codigo_empresa: sap.ui.core.Fragment.byId("frmDialogMargErrPrem", "empresa").getValue(),
				valor_margem_limite: sap.ui.core.Fragment.byId("frmDialogMargErrPrem", "valor_margem_limite").getValue()
			};
			
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

			if (this.validateFields(boundItem)) {
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

			if (oObj.codigo_empresa === null || oObj.codigo_empresa === "") {
				var oEmpresa = sap.ui.core.Fragment.byId("frmDialogMargErrPrem", "empresa");
				oEmpresa.setValueState("Error");
				bValid = false;
			}
			return bValid;
		},

		validateDuplicates: function (oObj, oChangesModel, mParameters) {
		/*	var that = this;
			var oModel = this.getView().getModel();
			var sPath = oModel.createKey("/OZPSTA_CFG_MARGEM_ERRO_PREMIO", {
				codigo_empresa: oObj.codigo_empresa
			});

			oModel.read(sPath, {
				success: function (oData) {
					//Registro em Duplicidade
					var oBundle = that.getResourceBundle();
					var sMsg = oBundle.getText("msgDuplicidade", [oData.codigo_empresa, oData.codigo_evento_negocio]);
					sap.m.MessageBox.alert(sMsg);
				},
				error: function (oError) {
					oChangesModel.submitChanges(mParameters);
					oChangesModel.refresh();
				}
			});*/
		},

		onDataReceived: function () {

			var oTable = this.byId("tblDadosMargErrPrem");
			var i = 0;
			//var aTemplate = this.getTableErrorColumTemplate();
			oTable.getTable().getColumns().forEach(function (oLine) {

				var oFieldName = oLine.getId();
				oFieldName = oFieldName.substring(oFieldName.lastIndexOf("-") + 1, oFieldName.length);

				switch (oFieldName) {
				case "codigo_empresa":
				case "valor_margem_limite":
					oLine.setProperty("width", "150px");
					break;
				default:
					oLine.setProperty("width", "200px");
					break;
				}

				i++;
			});

		},

		onDownloadTemplatePressed: function () {
			sap.m.URLHelper.redirect("templates/template_margem_limite_premio.xlsx", true);
		},

		onfileSizeExceed: function () {
			sap.m.MessageBox.error(this.getResourceBundle().getText("MSG_FILE_SIZE"));
		},

		handleUploadComplete: function (oEvent) {
			var sResponseStatus = oEvent.getParameter("status");
			if (sResponseStatus === 202) {
				var sResponse = oEvent.getParameter("responseRaw");
				MessageToast.show(sResponse);
				var oFileUploader = this.byId("fileUploader");
				oFileUploader.setValue("");
				var obtnImportFile = this.byId("btnImportFile");
				obtnImportFile.setVisible(false);

				var oModel = this.getView().getModel();
				oModel.refresh();
			}else{
					MessageToast.show("Erro ao fazer upload do arquivo");
			}
		},

		handleUploadPress: function (oEvent) {
			var oFileUploader = this.byId("fileUploader");
			if (!oFileUploader.getValue()) {
				MessageToast.show("Nenhum arquivo selecionado");
				return;
			}

			oFileUploader.addHeaderParameter(
				new sap.ui.unified.FileUploaderParameter({
					name: "X-CSRF-Token",
					value: this.getView().getModel().getSecurityToken()
				})
			);

			oFileUploader.setSendXHR(true);

			oFileUploader.upload();
		},

		handleTypeMissmatch: function (oEvent) {
			var aFileTypes = oEvent.getSource().getFileType();
			jQuery.each(aFileTypes, function (key, value) {
				aFileTypes[key] = "*." + value;
			});
			var sSupportedFileTypes = aFileTypes.join(", ");
			MessageToast.show("O Tipo do arquivo *." + oEvent.getParameter("fileType") +
				" não permitido. Selecione arquivos dos seguintes tipos: " +
				sSupportedFileTypes);
		},

		handleValueChange: function (oEvent) {
			var obtnImportFile = this.byId("btnImportFile");
			obtnImportFile.setVisible(true);

		}

	});
});