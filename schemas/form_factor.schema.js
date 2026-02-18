const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const FormFactor = sequelize.define(
    "FormFactor",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        comment: "FF_2_5 | FF_3_5 | M2_2280 | M2_2260 | M2_2242",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "form_factor",
      timestamps: false,
    },
  );

  FormFactor.associate = (models) => {
    FormFactor.hasMany(models.Ssd, { foreignKey: "formFactorId", as: "ssds" });
    FormFactor.hasMany(models.Hdd, { foreignKey: "formFactorId", as: "hdds" });
  };

  return FormFactor;
};
