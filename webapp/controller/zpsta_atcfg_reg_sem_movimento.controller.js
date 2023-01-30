sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/m/MessageToast"
], function (
	BaseController, MessageToast
) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.zpsta_atcfg_reg_sem_movimento", {

		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact");
			this.bEdit = false;
			this.getRouter().getRoute("reg_sem_movimento").attachPatternMatched(this._onObjectMatched, this);

		},

		_onObjectMatched: function (oEvent) {

			var smartFilterBar = this.getView().byId("smartFilterBarRegSMov");
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
				var tblDados = that.byId("tblDadosRegSMov").getTable(),
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
				"codigo_empresa": null,
				"codigo_evento_negocio": null,
				"origem": null,
				"field01": null,
				"field02": null,
				"field03": null,
				"field04": null,
				"field05": null,
				"field06": null,
				"field07": null,
				"field08": null,
				"field09": null,
				"field10": null,
				"naoprocessar": 0
			};

			var oModel = this.getOwnerComponent().getModel();
			var oContext = oModel.createEntry("/OZPSTA_ATCFG_REG_SEM_MOV", {
				properties: newItem
			});

			this._oContext = oContext;

			this.bEdit = false;

			var dialog = this._getDialog("portoseguro.zpstaparametros.view.dialogs.ZPSTA_ATCFG_REG_SEM_MOVIMENTODialog");
			sap.ui.core.Fragment.byId("frmDialogRegSMov", "formRegSMov").bindElement(oContext.getPath());
			dialog.open();

		},

		onEdit: function (oEvent) {
			var tblDados = this.byId("tblDadosRegSMov").getTable(),
				selectedIndices = tblDados.getSelectedIndices();

			if (selectedIndices.length === 1) {
				this.bEdit = true;
				var oSelIndex = tblDados.getSelectedIndex();
				var oContext = tblDados.getContextByIndex(oSelIndex);
				var dialog = this._getDialog("portoseguro.zpstaparametros.view.dialogs.ZPSTA_ATCFG_REG_SEM_MOVIMENTODialog");
				sap.ui.core.Fragment.byId("frmDialogRegSMov", "formRegSMov").bindElement(oContext.getPath());
				dialog.open();
			} else {
				var oBundle = this.getResourceBundle();
				var sMsg = oBundle.getText("msgMultiplosItensEdicao");
				MessageToast.show(sMsg);
			}

		},

		onAdd: function () {

			var model = sap.ui.core.Fragment.byId("frmDialogRegSMov", "formRegSMov").getModel();
			var path = sap.ui.core.Fragment.byId("frmDialogRegSMov", "formRegSMov").getElementBinding().getPath();
			var oContextItem = model.getProperty(path);
			var boundItem = {
				codigo_empresa: sap.ui.core.Fragment.byId("frmDialogRegSMov", "empresa").getValue(),
				codigo_evento_negocio: sap.ui.core.Fragment.byId("frmDialogRegSMov", "evento_negocio").getValue(),
				field01: sap.ui.core.Fragment.byId("frmDialogRegSMov", "field01").getValue(),
				origem: sap.ui.core.Fragment.byId("frmDialogRegSMov", "cmbOrigens").getSelectedKey()
			};
			//oContextItem.origem = boundItem.origem;
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
				if (!this.bEdit) {
					this.validateDuplicates(boundItem, model, mParameters);
				} else {
					model.submitChanges(mParameters);
					model.refresh();
				}

			} else {
				var oBundle = this.getResourceBundle();
				var sMsg = oBundle.getText("msgCamposObrigatorios");
				MessageToast.show(sMsg);
			}

		},

		validateFields: function (oObj) {
			var bValid = true;

			if (oObj.codigo_empresa === null || oObj.codigo_empresa === "") {
				var oEmpresa = sap.ui.core.Fragment.byId("frmDialogRegSMov", "empresa");
				oEmpresa.setValueState("Error");
				bValid = false;
			}
			if (oObj.codigo_evento_negocio === null || oObj.codigo_evento_negocio === "") {
				var oEventoNegocio = sap.ui.core.Fragment.byId("frmDialogRegSMov", "evento_negocio");
				oEventoNegocio.setValueState("Error");
				bValid = false;
			}
			if (oObj.field01 === null || oObj.field01 === "") {
				var oField01 = sap.ui.core.Fragment.byId("frmDialogRegSMov", "field01");
				oField01.setValueState("Error");
				bValid = false;
			}
			if (oObj.origem === null || oObj.origem === "") {
				var oOrigem = sap.ui.core.Fragment.byId("frmDialogRegSMov", "cmbOrigens");
				oOrigem.setValueState("Error");
				bValid = false;
			}
			return bValid;
		},

		validateDuplicates: function (oObj, oChangesModel, mParameters) {
			var that = this;
			var oModel = this.getView().getModel();
			var sPath = oModel.createKey("/OZPSTA_ATCFG_REG_SEM_MOV", {
				codigo_empresa: oObj.codigo_empresa,
				codigo_evento_negocio: oObj.codigo_evento_negocio
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
			});
		},

		onDataReceived: function () {

			var oTable = this.byId("tblDadosRegSMov");
			var i = 0;
			//var aTemplate = this.getTableErrorColumTemplate();
			oTable.getTable().getColumns().forEach(function (oLine) {

				var oFieldName = oLine.getId();
				oFieldName = oFieldName.substring(oFieldName.lastIndexOf("-") + 1, oFieldName.length);

				switch (oFieldName) {
				case "codigo_empresa":
				case "codigo_evento_negocio":
				case "naoprocessar":
				case "origem":
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
			sap.m.URLHelper.redirect("templates/template_reg_sem_mov.xlsx", true);
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