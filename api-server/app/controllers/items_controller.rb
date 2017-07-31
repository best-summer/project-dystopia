class ItemsController < ApplicationController
  def index
    # 全ユーザの情報を表示する
    @items = Item.all.as_json
    render json: @items
  end

  def show
    @user = User.find_by(name: params[:name])
    p @user.id
    @item = @user.item
    if @user.authenticate_only_login_key?(params)
      # render 'show', formats: 'json'
      render json: @item.as_json
    else
      render :nothing => true, status: :unprocessable_entity
    end
  end

  def create
    @user = User.find_by(name: params[:name])
    @item = Item.new(name: params[:item][:name], value: params[:item][:value],
                     user_id: @user.id)
    if @user.authenticate_only_login_key?(params) && @item.save
      # render 'create', formats: 'json'
      render json: @item.as_json
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end


  def update
  end

  def destroy
  end
end
