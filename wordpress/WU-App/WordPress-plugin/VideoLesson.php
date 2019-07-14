<?php
/**
 * Created by PhpStorm.
 * User: bawan
 * Date: 2019/4/13
 * Time: 20:46
 */

class WU_Custom_VideoLesson_Controller{
    const CUSTOM_POST_TYPE = 'wu_video';

    public function __construct()
    {
        add_action( 'init', array($this,'create_post_type_review') );//注册自定义文章类型函数
        add_action( 'save_post', array($this,'save_custom_post_fields'), 10, 2 );//注册一个 Save Post 函数
        add_action( 'init', array($this,'create_my_taxonomies'), 0 );//创建自定义分类
        add_filter('manage_wu_video_posts_columns', array($this,'add_new_wu_video_columns'));//给视频列表添加自定义列
        add_action( 'manage_posts_custom_column', array($this,'populate_columns'), 10, 2);//填充列，2代表两个参数
    }

    //=======================1.注册自定义文章类型==================================
    function create_post_type_review() {
        register_post_type( self::CUSTOM_POST_TYPE,
            array(
                'labels' => array(
                    'name' => '所有视频',//仪表盘中显示这个自定义文章类型的名字
                    'singular_name' => 'Movie Review',
                    'add_new' => '添加视频',
                    'add_new_item' => '添加新的视频课程',
                    'edit' => 'Edit',
                    'edit_item' => '编辑视频',//点编辑后的页面标题
                    'new_item' => 'New Movie Review',
                    'view' => 'View',
                    'view_item' => 'View Movie Review',
                    'search_items' => 'Search Movie Reviews',
                    'not_found' => '您还没有添加视频',
                    'not_found_in_trash' => 'No Movie Reviews found in Trash',
                    'parent' => 'Parent Movie Review'
                ),
                'show_in_rest' => true,
                //决定自定义文章类型在管理后台和前端的可见性
                'public' => true,
                //决定自定义文章类型菜单的位置
                'menu_position' => 5,
                //决定显示哪些自定义文章类型的功能
                'supports' => array(
                    'title',
//                    'editor',
//                    'comments',
                    'thumbnail',
//                    'custom-fields'
                ),
                //创建自定义分类。在这里没有定义
//                'taxonomies' => array( 'wu_video_genre' ),
                //显示管理菜单的图标
                'menu_icon' => plugins_url( 'images/video.png', __FILE__ ),
                //启用自定义文章类型的存档功能
                'has_archive' => true,
                // 提供一个回调函数，用于设置编辑表单的元框
                'register_meta_box_cb' => array($this,'create_meta_box')
            )
        );
    }

    //=======================2.添加meta box========================================
    function create_meta_box() {
        add_meta_box( self::CUSTOM_POST_TYPE . '_meta_box',//所需的HTML的id属性
            //meta box 标题中的可见文本内容
            '视频详情',
            //显示 meta box 内容的回调,this代表调用当前类对象的函数
            array($this,'display_meta_box'),
            //显示meta box的自定义文章类型名称
            self::CUSTOM_POST_TYPE,
            'normal', 'high'
        );
    }

    //=======================3.展示meta box==============================================
    function display_meta_box($custom_post) {
        $video_url = esc_html( get_post_meta( $custom_post->ID, 'video_url', true ) );
        ?>
        <table>
            <tr>
                <td style="width: 100%">视频url</td>
                <td><input type="text" size="80" name="wu_video_video_url" value="<?php echo $video_url; ?>" /></td>
            </tr>

        </table>
        <?php
    }

    //=======================4.保存自定义文章内容==============================================
    function save_custom_post_fields( $custom_post_id, $custom_post ) {
        if ( $custom_post->post_type == self::CUSTOM_POST_TYPE ) {
            if ( isset( $_POST['wu_video_video_url'] ) && $_POST['wu_video_video_url'] != '' ) {
                update_post_meta( $custom_post_id, 'video_url', $_POST['wu_video_video_url'] );
            }
        }
    }

    //=======================创建自定义分类==============================================
    function create_my_taxonomies() {
        register_taxonomy(
            'wu_video_genre',//自定义分类id
            self::CUSTOM_POST_TYPE,//属于哪种文章类型
            array(
                'public' => true,
//                'show_in_rest' => true,
                'labels' => array(
                    'name' => '视频分类',
                    'add_new_item' => '添加分类',
                    'new_item_name' => "New Movie Type Genre"
                ),
                'show_ui' => true,
//                'show_tagcloud' => false,
                'hierarchical' => true,//开启后，添加视频时候显示自定义的分类
            )
        );
    }

    //=======================视频列表添加自定义列==============================================
    function add_new_wu_video_columns($wu_video_columns){
        $wu_video_columns['author'] = __('Author');
        $wu_video_columns['videoURL'] = '视频url';
        $wu_video_columns['id'] = __('ID');
//        $wu_video_columns['categories'] = __('Categories');;
        return $wu_video_columns;
    }

    //================================填充列数据=============================================
    function populate_columns($column,$id) {
        switch ($column){
            case 'id':
                echo $id;
                break;
            case 'videoURL':
                $videoURL = esc_html( get_post_meta( get_the_ID(), 'video_url', true ) );
                if (strlen($videoURL)>30){
                    echo substr($videoURL,0,30) . '...';
                }else{
                    echo $videoURL;
                }
                break;
            default:
                break;
        }

    }
}//自定义视频管理面板
$custom_video = new WU_Custom_VideoLesson_Controller();


class WU_Tax_Image{

    function __construct(){

        // 新建分类页面添加自定义字段输入框
        add_action( 'wu_video_genre_add_form_fields', array( $this, 'add_tax_image_field' ) );
        // 编辑分类页面添加自定义字段输入框
        add_action( 'wu_video_genre_edit_form_fields', array( $this, 'edit_tax_image_field' ) );

        // 保存自定义字段数据
        add_action( 'edited_wu_video_genre', array( $this, 'save_tax_meta' ), 10, 2 );
        add_action( 'create_wu_video_genre', array( $this, 'save_tax_meta' ), 10, 2 );


    } // __construct

    /**
     * 新建分类页面添加自定义字段输入框
     */
    public function add_tax_image_field(){
        ?>
        <div class="form-field">
            <label for="term_meta[tax_image]">分类封面</label>
            <input type="text" name="term_meta[tax_image]" id="term_meta[tax_image]" value="" />
            <p class="description">输入分类封面图片URL</p>
        </div><!-- /.form-field -->

        <!-- TODO: 在这里追加其他自定义字段表单，如： -->

        <!--
        <div class="form-field">
            <label for="term_meta[tax_keywords]">分类关键字</label>
            <input type="text" name="term_meta[tax_keywords]" id="term_meta[tax_keywords]" value="" />
            <p class="description">输入分类关键字</p>
        </div>
        -->
        <?php
    } // add_tax_image_field

    /**
     * 编辑分类页面添加自定义字段输入框
     *
     * @uses get_option()       从option表中获取option数据
     * @uses esc_url()          确保字符串是url
     */
    public function edit_tax_image_field( $term ){

        // $term_id 是当前分类的id
        $term_id = $term->term_id;

        // 获取已保存的option
        $term_meta = get_option( "wu_$term_id" );
        // option是一个二维数组
        $image = $term_meta['tax_image'] ? $term_meta['tax_image'] : '';

        /**
         *   TODO: 在这里追加获取其他自定义字段值，如：
         *   $keywords = $term_meta['tax_keywords'] ? $term_meta['tax_keywords'] : '';
         */
        ?>
        <tr class="form-field">
            <th scope="row">
                <label for="term_meta[tax_image]">分类封面</label>
            <td>
                <input type="text" name="term_meta[tax_image]" id="term_meta[tax_image]" value="<?php echo esc_url( $image ); ?>" />
                <p class="description">输入分类封面图片URL</p>
            </td>
            </th>
        </tr><!-- /.form-field -->

        <!-- TODO: 在这里追加其他自定义字段表单，如： -->

        <!--
        <tr class="form-field">
            <th scope="row">
                <label for="term_meta[tax_keywords]">分类关键字</label>
                <td>
                    <input type="text" name="term_meta[tax_keywords]" id="term_meta[tax_keywords]" value="<?php echo $keywords; ?>" />
                    <p class="description">输入分类关键字</p>
                </td>
            </th>
        </tr>
        -->

        <?php
    } // edit_tax_image_field

    /**
     * 保存自定义字段的数据
     *
     * @uses get_option()      从option表中获取option数据
     * @uses update_option()   更新option数据，如果没有就新建option
     */
    public function save_tax_meta( $term_id ){

        if ( isset( $_POST['term_meta'] ) ) {

            // $term_id 是当前分类的id
            $t_id = $term_id;
            $term_meta = array();

            // 获取表单传过来的POST数据，POST数组一定要做过滤
            $term_meta['tax_image'] = isset ( $_POST['term_meta']['tax_image'] ) ? esc_url( $_POST['term_meta']['tax_image'] ) : '';

            /**
             *   TODO: 在这里追加获取其他自定义字段表单的值，如：
             *   $term_meta['tax_keywords'] = isset ( $_POST['term_meta']['tax_keywords'] ) ? $_POST['term_meta']['tax_keywords'] : '';
             */

            // 保存option数组
            update_option( "wu_$t_id", $term_meta );

        } // if isset( $_POST['term_meta'] )
    } // save_tax_meta

} //视频分类添加自定义图片url字段
$wptt_tax_image = new WU_Tax_Image();


class WU_Api_VideoLesson_Controller{
    public function __construct() {
        $this->namespace     = '/wu-app/v1';//定义命名空间
        $this->resource_name = '/video';
        add_action( 'rest_api_init', array($this,'register_routes') );//路由
    }

    //=======================注册路由=========================================
    public function register_routes() {
        //获取分类列表路由
        register_rest_route( $this->namespace,$this->resource_name . '/catelist', array(
            array(
                'methods'   => 'GET',
                'callback'  => array( $this, 'get_categories' ),//定义回调函数
            )
        ) );
        //获取视频列表路由
        register_rest_route( $this->namespace,$this->resource_name . '/posts', array(
            array(
                'methods'   => 'GET',
                'callback'  => array( $this, 'get_videoList' ),//定义回调函数
            )
        ) );
    }

    // =======================获取视频分类列表=========================================
    public function get_categories($request){
        //获取顶级分类列表
        $categories = get_categories(array(
            'parent'  => 0,
            'taxonomy' => 'wu_video_genre',
        ));
        $categories2 = $this->set_Fields($categories,array(
            'cat_name',
            'cat_ID'
        ));
        $categories3 = array();
        foreach ($categories2 as $data){
            // 获取已保存的option
            $termid = $data['cat_ID'];
            $term_meta = get_option( "wu_$termid" );
            // option是一个二维数组
            $image = $term_meta['tax_image'] ? $term_meta['tax_image'] : '';
            $data['image'] = $image;
                array_push($categories3,$data);
        }
        return rest_ensure_response( $categories3 );
    }

    // =======================获取视频列表=========================================
    public function get_videoList($request){
        $args = array(
            'post_type' => 'wu_video',// 文章类型
            'post_status' => 'publish',
            'posts_per_page' => $request['limit'],//每页数量
            'offset'           => $request['page'],//第几页
            'orderby' => 'id', //根据id排序
            'order' => 'ASC',//接受'ASC'（升序）或'DESC'（降序）
            'tax_query' => array(
                array(
                    'taxonomy' => 'wu_video_genre', // 分类法
                    'field' => 'id',
                    'terms' => $request['cat_ID']
                )
            ),
        );
        $videoList = get_posts( $args );
        $videoList2 = $this->set_Fields($videoList,array(
            'ID',
            'post_title',
        ));
        $videoList3 = array();
        foreach ($videoList2 as $data){
            $video_url = esc_html(get_post_meta( $data['ID'], 'video_url', true ));
            $data['videoURL'] = $video_url;
            array_push($videoList3,$data);
        }
        return rest_ensure_response($videoList3);
    }

    /**
     * 设置想要显示的字段，过滤掉不显示的字段
     *  $objList 对象列表，一般是get_posts,或者get_categories返回值
     *  $fields想要显示的字段数组
     *  array 返回过滤后的对象列表
     */
    public function set_Fields($objList,$fields){
        $data = array();
        foreach ($objList as $obj){
            $tem = array();
            foreach ($fields as $key){
                $tem[$key] = $obj->$key;
            }
            array_push($data,$tem);
        }
        return $data;
    }
}//视频REST API接口
$video_api = new WU_Api_VideoLesson_Controller();