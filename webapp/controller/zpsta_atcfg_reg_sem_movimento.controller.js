sap.ui.define([
	"portoseguro/zpstaparametros/controller/BaseController",
	"sap/m/MessageToast"
], function (
	BaseController,
	MessageToast
) {
	"use strict";

	return BaseController.extend("portoseguro.zpstaparametros.controller.zpsta_atcfg_reg_sem_movimento", {
		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact")

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
				var tblDados = that.byId("tblDadosRegSMov").getTable(),
					selectedIndices = tblDados.getSelectedIndices();

				if (selectedIndices.length > 0) {

					selectedIndices.forEach(function (selectedIndex) {

						var context = tblDados.getContextByIndex(selectedIndex);
						var oModel = that.getOwnerComponent().getModel();
						oModel.setUseBatch(false);
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
				"CodigoEmpresa": "",
				"CodigoEventoNegocio": null,
				"Origem": null,
				"Field01": null,
				"Field02": null,
				"Field03": null,
				"Field04": null,
				"Field05": null,
				"Field06": null,
				"Field07": null,
				"Field08": null,
				"Field09": null,
				"Field10": null,
				"Naoprocessar": 0
			};

			var oModel = this.getOwnerComponent().getModel();
			var oContext = oModel.createEntry("/OZPSTA_ATCFG_REG_SEM_MOV", {
				properties: newItem
			});
			var dialog = this._getDialog("frmDialogRegSMov", "portoseguro.zpstaparametros.view.dialogs.ZPSTA_ATCFG_REG_SEM_MOVIMENTODialog");
			sap.ui.core.Fragment.byId("frmDialogRegSMov", "formRegSMov").bindElement(oContext.getPath());
			dialog.open();

		},
		onAdd: function () {
			var that = this;
			var model = sap.ui.core.Fragment.byId("frmDialogRegSMov", "formRegSMov").getModel();
			var path = sap.ui.core.Fragment.byId("frmDialogRegSMov", "formRegSMov").getElementBinding().getPath();
			var boundItem = model.getProperty(path);
			if (boundItem) {
				var bDuplicateKeys = false;
				var aKeys = Object.keys(model.oData);
				var odata = model.oData;
				model.mChangedEntities = {};
				for (var record in odata) {
					if (boundItem.CodigoEmpresa == odata[record].CodigoEmpresa
						&& boundItem.CodigoEventoNegocio == odata[record].CodigoEventoNegocio) {
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
							that.getView().byId('tblDadosRegSMov').rebindTable();
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
		},
			onEdit: function (oEvent) {
				var tblDados = this.byId("tblDadosRegSMov").getTable(),
					selectedIndices = tblDados.getSelectedIndices();

				if (selectedIndices.length === 1) {
					this.bEdit = true;
					var oSelIndex = tblDados.getSelectedIndex();
					var oContext = tblDados.getContextByIndex(oSelIndex);
					var dialog = this._getDialog("frmDialogRegSMov", "portoseguro.zpstaparametros.view.dialogs.ZPSTA_ATCFG_REG_SEM_MOVIMENTODialog");
					sap.ui.core.Fragment.byId("frmDialogRegSMov", "formRegSMov").bindElement(oContext.getPath());
					dialog.open();
				} else {
					var oBundle = this.getResourceBundle();
					var sMsg = oBundle.getText("msgMultiplosItensEdicao");
					MessageToast.show(sMsg);
				}

			},
/* 			onDataReceived: function () {

				var oTable = this.byId("tblDadosRegSMov");
				var i = 0;
				//var aTemplate = this.getTableErrorColumTemplate();
				oTable.getTable().getColumns().forEach(function (oLine) {

					var oFieldName = oLine.getId();
					oFieldName = oFieldName.substring(oFieldName.lastIndexOf("-") + 1, oFieldName.length);

					switch (oFieldName) {
						case "CodigoEmpresa":
						case "CodigoEventoNegocio":
						case "Naoprocessar":
						case "Origem":
							oLine.setProperty("width", "150px");
							break;
						default:
							oLine.setProperty("width", "200px");
							break;
					}

					i++;
				});

			}, */

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
				} else {
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