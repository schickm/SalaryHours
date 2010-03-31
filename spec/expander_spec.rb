require File.dirname(__FILE__) + '/spec_helper.rb'

require "expander"

describe Expander do
  before(:each) do
    @exp = Expander.new
  end

  describe "#run" do
    describe "with []" do
      it "should return []" do
        @exp.run([]).should == []
      end
    end

    describe "with nil" do
      it "should return []" do
        @exp.run(nil).should == []
      end
    end
   
    describe "with a complex list" do
      it "should return listings grouped by date with date applied to all" do
        start = [{"1/2/10" =>
                   [
                    {"site setup" => "1:46pm - 2:20pm"},
                    {"wordpress setup" => "2:20pm - 3:43pm"}]}]
        result = [
                  { :label => "site setup",
                    :start => Time.mktime(2010, 1, 2, 13, 46),
                    :end => Time.mktime(2010, 1, 2, 14, 20)},
                  { :label => "wordpress setup",
                    :start => Time.mktime(2010, 1, 2, 14, 20),
                    :end => Time.mktime(2010, 1, 2, 15, 43)}]
        @exp.run(start).should == result
      end
    end

    describe "with a list containing duplicate values" do
      before(:each) do
        @data = [{'$200' =>
                   {'3/2/10' => 
                     ['5:30am - 8:24am',
                      {'$300' => '8:40am - 9:30am'}]}}]
      end
                    
      it "should return the deeper value in the list" do
        result = [{ :rate => 200,
                    :start => Time.mktime(2010, 3, 2, 5, 30),
                    :end => Time.mktime(2010, 3, 2, 8, 24)},
                  { :rate => 300,
                    :start => Time.mktime(2010, 3, 2, 8, 40),
                    :end => Time.mktime(2010, 3, 2, 9, 30)}]
        @exp.run(@data).should == result
      end
    end
  end

  describe "#merge_data" do
    before(:each) do
      @params = {}
    end

    describe "with '1/2/10'" do
      before(:each) do
        @params = @exp.merge_data(@params, '1/2/10')
      end
      
      it "should add :data to params" do
        @params.should include(:date)
      end

      it "should add time to params[:data] of 1/2/2010" do
        @params[:date].strftime("%m/%d/%Y").should == "01/02/2010"
      end
    end
    
    
    describe "with 'some task label'" do
      before(:each) do
        @params = @exp.merge_data(@params, 'some task label')
      end

      it "should add :label to params" do
        @params.should include(:label)
      end

      it "should add 'some task label' to params[:label]'" do
        @params[:label].should == 'some task label'
      end
    end

    describe "with '8:55pm - 9:13pm'" do
      before(:each) do
        @params = @exp.merge_data(@params, '8:55pm - 9:13pm')
      end

      it "should add :time to params" do
        @params.should include(:time)
      end

      it "should add 8:55pm in params[:time][:start]" do
        @params[:time][:start].strftime("%I:%M%p").should == '08:55PM'
      end

      it "should add 9:13pm in params[:time][:end]" do
        @params[:time][:end].strftime("%I:%M%p").should == '09:13PM'
      end
    end
  end
end
