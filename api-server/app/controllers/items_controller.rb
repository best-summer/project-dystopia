class ItemsController < ApplicationController
  def index
    # 全ユーザの情報を表示する
    @items = Item.all.as_json
    render json: @items
  end

  def show
    @user = User.find_by(name: params[:name])
    @items = @user.item
    if @user.authenticate_only_login_key?(params)
      render 'show', formats: 'json'
    else
      render json: {status: 'ng', message: 'Wrong login key'}
    end
  end

  def create
    @user = User.find_by(name: params[:name])
    @item = Item.new(name: params[:item][:name], value: params[:item][:value],
                     user_id: @user.id)
    if @user.authenticate_only_login_key?(params) && @item.save
      render json: @item.as_json
    else
      render json: {status: 'ng', message: 'Wrong login key'}
    end
  end

  #  PATCH /users/:name/items?login_key
  # アイテム情報の更新を行う
  def update
    p params
    @user = User.find_by(name: params[:name])
    @item = @user.item.find_by(name: params[:item][:name])

    for param in params[:item]
      p param
      p params[:item][param]
      p @item[param] = params[:item][param]
    end

    if @user.authenticate_only_login_key?(params) && @item.save
      render 'update', formats: 'json'
    else
      render json: {status: 'ng', message: 'Wrong login key'}
    end
  end



  def destroy
  end
end
