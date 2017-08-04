class ItemsController < ApplicationController
  def index
    # 全アイテムの情報を表示する(デバッグ用)
    @items = Item.all.as_json(except: ['updated_at', 'created_at'])
    render json: @items
  end

  def show
    #  POST /users/:name/items?login_key
    # ユーザの所有しているアイテムを表示する
    @user = User.find_by(name: params[:name])
    @items = @user.item
    if @user.authenticate_only_login_key?(params)
      render 'show', formats: 'json'
    else
      render json: {status: 'ng', message: 'Wrong login key'}
    end
  end

  def create
    #  POST /users/:name/items
    # ユーザのアイテムを作成する
    @user = User.find_by(name: params[:name])
    @item = Item.new(name: params[:item][:name], value: params[:item][:value],
                     number: params[:item][:number], user_id: @user.id)
    # DBの初期値をnilから0に変更すればこの処理は必要なくなるはず
    if @user[:billing].nil?
      @user[:billing] = 0
    end
    # ユーザの課金合計額にアイテムの価格を加算しておく
    @user[:billing] += @item[:value] * @item[:number]
    @user.save
    if @user.authenticate_only_login_key?(params) && @item.save
      render 'create', formats: 'json'
    elsif !@user.authenticate_only_login_key?(params)
      render json: {status: 'ng', message: 'Wrong login key'}
    elsif !@item.save
      render json: {status: 'ng', message: 'Item is already exists or Key is not enough'}
    end
  end

  #  PATCH /users/:name/items
  # ユーザのアイテム情報の更新をする
  def update
    @user = User.find_by(name: params[:name])
    @item = @user.item.find_by(name: params[:item][:name])
    if @item.nil?
      render json: {status: 'ng', message: 'user_name or item_name is wrong'}
      return
    end
    for param in params[:item]
      @item[param] = params[:item][param]
    end
    if @user.authenticate_only_login_key?(params) && @item.save
      render 'update', formats: 'json'
    elsif !@user.authenticate_only_login_key?(params)
      render json: {status: 'ng', message: 'Wrong login key'}
    elsif !@item.save
      render json: {status: 'ng', message: 'Key is not enough'}
    end
  end

  def destroy
  end
end
