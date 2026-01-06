<script>
import { guid } from "uview-plus";
import { login } from "@/api/setup.js";
import { userinfoStore } from "@/store/userinfos";

export default {
  onLaunch: function () {
    console.log("App Launch");
    if (uni.getStorageSync("token")) return;

    // 统一的GUID生成方案 - 不依赖条件编译
    console.log("=== 开始生成GUID参数 ===");
    console.log("当前平台信息:", uni.getSystemInfoSync());
    console.log("guid函数是否存在:", typeof guid);

    // 首先尝试使用uview-plus的guid函数
    let guid_name, guid_password;

    try {
      // 尝试使用uview-plus的guid函数
      console.log("步骤1: 调用guid()函数...");
      guid_name = guid();
      console.log(
        "第一次调用guid()结果:",
        guid_name,
        "类型:",
        typeof guid_name
      );

      guid_password = guid();
      console.log(
        "第二次调用guid()结果:",
        guid_password,
        "类型:",
        typeof guid_password
      );

      console.log(
        "使用uview-plus GUID成功 - name:",
        guid_name,
        "password:",
        guid_password
      );
    } catch (error) {
      console.warn("uview-plus guid函数失败:", error);
      console.warn("错误详情:", error.message);
      guid_name = null;
      guid_password = null;
    }

    // 如果uview-plus的guid失败，使用自定义GUID生成
    if (!guid_name || !guid_password) {
      console.log("步骤2: 使用自定义GUID生成方案");
      console.log("当前guid_name:", guid_name, "guid_password:", guid_password);

      const generateGuid = () => {
        console.log("开始生成自定义GUID...");
        const result = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
        console.log(
          "生成的GUID:",
          result,
          "类型:",
          typeof result,
          "长度:",
          result.length
        );
        return result;
      };

      console.log("生成第一个GUID...");
      guid_name = generateGuid();
      console.log("生成第二个GUID...");
      guid_password = generateGuid();
      console.log(
        "自定义GUID完成 - name:",
        guid_name,
        "password:",
        guid_password
      );
    }

    // 最终验证 - 如果还是为空，使用最简单的方案
    if (!guid_name || !guid_password) {
      console.error("所有GUID生成方案都失败，使用最简单的方案");
      guid_name =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      guid_password =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      console.log(
        "最终备用GUID - name:",
        guid_name,
        "password:",
        guid_password
      );
    }

    // 最终参数构建和验证
    console.log("=== 最终参数构建 ===");
    console.log(
      "当前GUID状态 - guid_name:",
      guid_name,
      "guid_password:",
      guid_password
    );

    const stored_username = uni.getStorageSync("guid_name");
    const stored_password = uni.getStorageSync("guid_password");
    console.log(
      "存储的用户名:",
      stored_username,
      "存储的密码:",
      stored_password
    );

    const final_username = stored_username || guid_name;
    const final_password = stored_password || guid_password;
    console.log("最终用户名:", final_username, "最终密码:", final_password);

    // 强制验证 - 如果还是为空，使用硬编码值
    const username = final_username || "fallback_user_" + Date.now();
    const password = final_password || "fallback_pass_" + Date.now();
    console.log("强制验证后 - username:", username, "password:", password);

    const params = {
      username: uni.getStorageSync("guid_name") || guid_name,
      password: uni.getStorageSync("guid_password") || guid_password,
      // username:1111,
      // password:2222
    };

    console.log("=== 登录参数详细调试 ===");
    console.log("登录参数对象:", params);
    console.log("参数类型检查:");
    console.log(
      "- username类型:",
      typeof params.username,
      "值:",
      params.username
    );
    console.log(
      "- password类型:",
      typeof params.password,
      "值:",
      params.password
    );
    console.log(
      "- username长度:",
      params.username ? params.username.length : 0
    );
    console.log(
      "- password长度:",
      params.password ? params.password.length : 0
    );
    console.log("- username是否为空字符串:", params.username === "");
    console.log("- password是否为空字符串:", params.password === "");
    console.log("- username是否为null:", params.username === null);
    console.log("- password是否为null:", params.password === null);
    console.log("- username是否为undefined:", params.username === undefined);
    console.log("- password是否为undefined:", params.password === undefined);

    // 最终验证 - 确保参数绝对不为空
    if (
      !params.username ||
      !params.password ||
      params.username === "" ||
      params.password === ""
    ) {
      console.error("致命错误：登录参数为空！");
      console.error("详细错误信息:");
      console.error("- username:", JSON.stringify(params.username));
      console.error("- password:", JSON.stringify(params.password));
      console.error("- 参数对象:", JSON.stringify(params));
      return; // 停止执行
    }

    console.log("=== 开始发送登录请求 ===");
    console.log("请求URL: /auth/login/");
    console.log("请求方法: POST");
    console.log("请求体:", JSON.stringify(params));

    login(params)
      .then((res) => {
        console.log("登录成功:", res);
        uni.setStorageSync("guid_name", guid_name);
        uni.setStorageSync("guid_password", guid_password);
        // uni.setStorageSync("guid_name", 1111);
        // uni.setStorageSync("guid_password", 2222);
        uni.setStorageSync("user_info", res.data);
        uni.setStorageSync("token", res.data.token);
        console.log("xhwnggkwn", res.data.token);

        // 平台区分处理
        // 统一的用户信息处理逻辑 - 与H5端保持一致
        console.log("登录成功，处理用户信息:", res.data);

        // 检查登录响应中的用户ID
        const userId = res.data.user_id || res.data.id;
        console.log("用户ID:", userId);

        if (userId) {
          // 有用户ID，获取详细用户信息
          console.log("开始获取用户详细信息，用户ID:", userId);

          // #ifdef APP-PLUS
          // APP端：延迟调用 store
          setTimeout(() => {
            try {
              const store = userinfoStore();
              store
                .getUserinfo({ id: userId })
                .then(() => {
                  console.log("APP端：用户信息获取成功");
                })
                .catch((error) => {
                  console.error("APP端：获取用户信息失败:", error);
                  // 使用登录响应中的基本信息
                  const basicUserinfo = {
                    id: userId,
                    avatar: res.data.avatar || "",
                    username: res.data.username || "用户",
                    user_nickname:
                      res.data.user_nickname || res.data.username || "用户",
                    phone: res.data.phone || "",
                    email: res.data.email || "",
                    is_vip: res.data.is_vip || false,
                    member_level: res.data.member_level || 0,
                    gold_coin: res.data.gold_coin || 0,
                    vip_days: res.data.vip_days || 0,
                    status: res.data.status || 1,
                    followers_count: res.data.followers_count || 0,
                    following_count: res.data.following_count || 0,
                    likes_count: res.data.likes_count || 0,
                  };
                  store.userinfo = basicUserinfo;
                  uni.setStorageSync("userinfos_userinfo", basicUserinfo);
                  console.log("APP端：使用基本信息作为用户信息", basicUserinfo);
                });
            } catch (error) {
              console.error("APP端 store 初始化失败:", error);
            }
          }, 100);
          // #endif

          // #ifdef H5
          // H5端：正常使用 Pinia
          this.$nextTick(() => {
            const store = userinfoStore();
            store
              .getUserinfo({ id: userId })
              .then(() => {
                console.log("H5端：用户信息获取成功");
              })
              .catch((error) => {
                console.error("H5端：获取用户信息失败:", error);
              });
          });
          // #endif
        } else {
          console.error("登录响应中缺少用户ID");
          // 使用登录响应中的基本信息
          const basicUserinfo = {
            id: res.data.id || "unknown",
            avatar: res.data.avatar || "",
            username: res.data.username || "用户",
            user_nickname:
              res.data.user_nickname || res.data.username || "用户",
            phone: res.data.phone || "",
            email: res.data.email || "",
            is_vip: res.data.is_vip || false,
            member_level: res.data.member_level || 0,
            gold_coin: res.data.gold_coin || 0,
            vip_days: res.data.vip_days || 0,
            status: res.data.status || 1,
            followers_count: res.data.followers_count || 0,
            following_count: res.data.following_count || 0,
            likes_count: res.data.likes_count || 0,
          };

          // #ifdef APP-PLUS
          setTimeout(() => {
            try {
              const store = userinfoStore();
              store.userinfo = basicUserinfo;
              uni.setStorageSync("userinfos_userinfo", basicUserinfo);
              console.log("APP端：使用基本信息作为用户信息", basicUserinfo);
            } catch (error) {
              console.error("APP端：设置基本信息失败:", error);
            }
          }, 100);
          // #endif

          // #ifdef H5
          this.$nextTick(() => {
            const store = userinfoStore();
            store.userinfo = basicUserinfo;
            console.log("H5端：使用基本信息作为用户信息", basicUserinfo);
          });
          // #endif
        }
      })
      .catch((error) => {
        console.error("登录失败:", error);
        console.error("错误详情:", error);

        // 登录失败时的备用处理
        // #ifdef APP-PLUS
        // APP端：设置默认用户信息
        console.log("APP端：登录失败，设置默认用户信息");
        const fallbackUserinfo = {
          id: "guest",
          avatar: "",
          username: "guest",
          is_vip: false,
          user_nickname: "游客",
          phone: "",
          email: "",
          member_level: 0,
          gold_coin: 0,
          vip_days: 0,
          status: 1,
        };

        // 保存到多个存储位置，确保兼容性
        uni.setStorageSync("userinfos_userinfo", fallbackUserinfo);
        uni.setStorageSync("userinfo", fallbackUserinfo);
        uni.setStorageSync("user_info", fallbackUserinfo);

        // 同时更新store实例
        try {
          const store = userinfoStore();
          store.userinfo = fallbackUserinfo;
          console.log("APP端：store用户信息已更新");
        } catch (storeError) {
          console.warn("APP端：store更新失败，但本地存储已保存:", storeError);
        }

        console.log("APP端：默认用户信息设置完成", fallbackUserinfo);
        // #endif
      });
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
///* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-plus/index.scss";

/* #ifdef H5 */
:deep(.uni-tabbar) {
  .uni-tabbar__item:nth-of-type(4) {
    .uni-tabbar__icon {

      margin-top: -2px !important;
    }
  }
}
/* #endif */

/* #ifndef APP-NVUE */
page {
  --status-bar-height: 25px;
  --white-op-16: rgba(255, 255, 255, 0.16);
  /* 默认值兜底 */
  background-color: #1a1921;
  color: #fff;
}

// 导航栏搜索
.search {
  display: flex;
  align-items: center;
  background-color: var(--white-op-16);
  padding: 10rpx;
  border-radius: 100rpx;

  text {
    margin-left: 10rpx;
    margin-right: 15rpx;
    color: #fff;
  }
}

/* #endif */

/* #ifdef APP */
.navbar:before {
  display: block;
  content: "";
  height: var(--status-bar-height);
  width: 100%;
}

/* #endif */
</style>
