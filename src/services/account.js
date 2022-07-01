import dbRepo from "./dbRepo";

const Account = dbRepo["default"].model("Account");
export const AccountService = {
  getAccountByTenantId: async (tenantId) => {
    return new Promise(function (resolve, reject) {
      let account;
      try {
        account = Account.findOne({ tenantId: tenantId });
      } catch (err) {
        reject(err);
      }
      resolve(account ?? null);
    });
  },
};
