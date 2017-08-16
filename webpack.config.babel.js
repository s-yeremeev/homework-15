import { resolve } from "path"
import {
  /**используется ниже для CommonsChunkPlugin */
  optimize,

  /** NamedModulesPlugin - этот плагин приведет к отображению относительного пути модуля при включении HMR.*/
  NamedModulesPlugin
} from "webpack"

/** HtmlWebpackPlugin - упрощает создание файлов HTML для обслуживания webpack.
 *  Можно генерировать HTML-файл, поставлять свой собственный шаблон с использованием шаблонов lodash,
 *  либо использовать собственный загрузчик
 * Загрузка - npm install --save-dev html-webpack-plugin*/
import HtmlWebpackPlugin from "html-webpack-plugin"

export default () => ({
  /**devtool- эта опция контролирует, когда и как генерируются карты источников.
   * source-map -добавляет ссылочный комментарий к набору, в связи с этим знают, где его найти.
  */
  devtool: "source-map",

  /**entry - определения свойства записи в конфигурации webpack 
   * lodash - Этот плагин дополняет babel-plugin-lodash, уменьшая его сборки еще больше.
   * загрузка - npm i --save lodash
  */
  entry: {
    vendor: [
      "lodash"
    ],
    /**связь узлов */
    bundle: [
      resolve(__dirname, "src/index.js")
    ]
  },
  /**
   * output - выходной ключ верхнего уровня содержит набор опций, инструктирующих webpack о том,
   *  как и где он должен выводить ваши пакеты
   */
  output: {
    /**path - абсолютный путь */
    path: resolve(__dirname, "dist"),
    /**publicPath - загрузка внешних ресурсов */
    publicPath: "/",
    /**filename - определяет имя выходного пакета */
    filename: "bundle.js"
  },
  /** context - абсолютный путь, для разрешения точек входа и загрузчиков из конфигурации.*/
  context: resolve(__dirname, "src"),
  /**plugins используется для настройки процесса сборки webpack различными способами */
  plugins: [
    /** описан выше при импорте */
    new NamedModulesPlugin(),
    /** описано выше, при импорте */
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: resolve(__dirname, "html/index.html")
    }),

    /** CommonsChunkPlugin - извлекает логику бутстрапа webpack в отдельный файл
     * Отделяет общие модули от пучков, полученный файл сохранен в кеше для последующего использования.
     *  Это приводит к оптимизации страниц в скорости.
     * */
    new optimize.CommonsChunkPlugin({
      name: "vendor",
      /**для паралельной загрузки */
      minChunks: Infinity,
      filename: "vendor.js",
    })
  ],
  module: {
    rules: [
      /**подгрузка js */
      {
        test: /.js?$/,
        exclude: /node_modules/,
        include: resolve(__dirname, "src"),
        use: [
          {
              loader: "babel-loader"
          }          
        ]
      },
      /**подгрузка scss */
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  /**набор параметров выбирается webpack-dev-server и может использоваться
   *  для изменения его поведения различными способами */
  devServer: {
    contentBase: resolve(__dirname, "dist"),
    historyApiFallback: true,
    host: "0.0.0.0",
    port: 8080
  }
})