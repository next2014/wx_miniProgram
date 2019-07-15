<?php
/**
 * Created by PhpStorm.
 * User: bawan
 * Date: 2019/4/12
 * Time: 18:32
 */

class TuwenLesson_Controller
{
    //php构造方法，在实例类之前执行
    public function __construct() {
        $this->namespace     = '/wu-app/v1';//定义命名空间
    }

    //=======================注册路由=========================================
    public function register_routes() {
        //获取分类列表路由
        register_rest_route( $this->namespace,'/catelist', array(
            array(
                'methods'   => 'GET',
                'callback'  => array( $this, 'get_categories' ),//定义回调函数
            )
        ) );
        //获取文章列表路由
        register_rest_route( $this->namespace, '/articlelist', array(
            array(
                'methods'   => 'GET',
                'callback'  => array( $this, 'get_articles' ),//定义回调函数
            )
        ) );
        //获取置顶文章列表路由
        register_rest_route( $this->namespace, '/bannerlist', array(
            array(
                'methods'   => 'GET',
                'callback'  => array( $this, 'get_banner_list' ),//定义回调函数
            )
        ) );
    }

    // =======================获取分类列表=========================================
    public function get_categories( $request ) {
        //获取顶级分类列表
        $categories = get_categories(array(
            'parent'  => 0
        ));
        //遍历所有顶级分类
        $data = array();
        foreach ($categories as $cate){//$cate是一个对象
            //通过父类id获取子类列表
            $subCateList = get_categories(array(
                'parent' => $cate->cat_ID
            ));
            //遍历子类列表
            $subData = array();
            foreach ($subCateList as $subCate){
                //构造返回子类列表数据
                array_push($subData,array(
                    'cat_name' => $subCate->cat_name,
                    'cat_ID' => $subCate->cat_ID
                ));
            }
            //构造返回数据格式
            if ($cate->cat_ID != 1){//过滤默认的未分类
                array_push($data,array(
                    'cat_name'=>$cate->name,//获取$cate对象的属性
                    'cat_ID'=>$cate->cat_ID,
                    'open'=>false,
                    'subCats'=>$subData
                ));
            }
        }
        return rest_ensure_response( $data );
    }

    // =======================获取文章列表=========================================
    public function get_articles($request){
        //原始文章列表
        $articleList = get_posts(array(
            'posts_per_page'   => $request['limit'],//每页数量
            'offset'           => $request['page'],//第几页
            'category_name'    => $request['cat_name']//根据分类名称查找
        ));
        //过滤后的文章列表（数组，非对象数组）
        $datalist = $this->set_Fields($articleList,array(
            'ID',
            'post_title',
            'post_content',
            'guid',//文章url
            'post_date',//发布时间
            'post_author'
        ));
        //添加新字段的文章列表
        $dataList2 = array();
        foreach ($datalist as $data){
            //文章第一张图片作为缩略图
            $data['icon'] = $this->get_first_image($data['post_content']);
            //作者名称
            $data['author'] = get_user_meta($data['post_author'],'nickname',true);
            array_push($dataList2,$data);
        }
        return rest_ensure_response($dataList2);
    }
    // =======================获取置顶文章列表（作为banner轮播图）======================
    public function get_banner_list($request){
        $query_post = array(
            'posts_per_page' => 10,//的作用是排除非指定性文章，即除了置顶文章之外，不显示其他的文章
            'post__in' => get_option('sticky_posts'),//确定了该LOOP调用的是置顶文章列表
            'caller_get_posts' => 1//的作用是排除非指定性文章，即除了置顶文章之外，不显示其他的文章
        );
        $bannerList = query_posts($query_post);
        $bannerList2 = $this->set_Fields($bannerList,array(
            'ID',
            'post_title',
            'post_content',
            'guid',//文章url
        ));
        $bannerList3 = array();
        foreach ($bannerList2 as $banner){
            $banner['icon'] = $this->get_first_image($banner['post_content']);
            array_push($bannerList3,$banner);
        }
        return $bannerList3;
    }

    /**
     * 获取文章第一张图片
     * 文章内容（html格式）
     * @param $content
     * 返回图片url
     * @return int|string
     */
    public function get_first_image($content){
        $image=mt_rand(1,4);
        $pattern="/<[img|IMG].*?src=[\'|\"](.*?(?:[\.gif|\.jpg|\.png]))[\'|\"].*?[\/]?>/";
        preg_match_all($pattern,$content,$matchContent);
        if(isset($matchContent[1][0])){
            $image=$matchContent[1][0];
        }else{
            //plugins_url 当前插件目录下的文件路径，包含域名
            $image=plugins_url("images/random/defaultpic.gif",__file__);//需要在相应位置放置4张jpg的文件，名称为1，2，3，4
        }
        return $image;
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

}