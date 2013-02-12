var SudokuViewModel = function() {
	var sender = this;
	this.NeedsSave = ko.observable(false);
	this.Difficulty = ko.observable();
	this.Squares = ko.observableArray();

	this.SetSelectedCell = function(square, cell, displayInputPad) {
		for (var squareIndex = 0; squareIndex < sender.Squares().length; squareIndex++) {
			for (var cellIndex = 0; cellIndex < sender.Squares()[squareIndex].Cells().length; cellIndex++) {
				if(squareIndex == square && cellIndex == cell) {
					sender.Squares()[squareIndex].Cells()[cellIndex].IsSelected(true);
					if(displayInputPad) {
						sender.Squares()[squareIndex].Cells()[cellIndex].WasSelectedWithMouse(true);
					}
				} else {
					sender.Squares()[squareIndex].Cells()[cellIndex].IsSelected(false);
					sender.Squares()[squareIndex].Cells()[cellIndex].WasSelectedWithMouse(false);
				}
			};
		};
	};

	this.GetSelectedCell = function() {
		for (var squareIndex = 0; squareIndex < sender.Squares().length; squareIndex++) {
			for (var cellIndex = 0; cellIndex < sender.Squares()[squareIndex].Cells().length; cellIndex++) {
				if(sender.Squares()[squareIndex].Cells()[cellIndex].IsSelected()) {
					return {
						square: squareIndex,
						cell: cellIndex
					};
				}
			};
		};
	};

	this.SetCellValue = function(square, cell, value) {
		if(sender.Squares()[square].Cells()[cell].IsEditable()) {
			sender.Squares()[square].Cells()[cell].CurrentValue(value);
			sender.Squares()[square].Cells()[cell].WasSelectedWithMouse(false);
			sender.Squares()[square].Cells()[cell].IsValid(true);
			sender.RequestSave();
        }
	};

	this.SelectClickedCell = function(data) {
		for (var squareIndex = 0; squareIndex < sender.Squares().length; squareIndex++) {
			for (var cellIndex = 0; cellIndex < sender.Squares()[squareIndex].Cells().length; cellIndex++) {
				if(data.ColIndex() == sender.Squares()[squareIndex].Cells()[cellIndex].ColIndex() && 
					data.RowIndex() == sender.Squares()[squareIndex].Cells()[cellIndex].RowIndex()) {
					return sender.SetSelectedCell(squareIndex, cellIndex, true);
				}
			};
		};
	};

	this.SetValueFromInputPad = function(value, data, evt) {
		for (var squareIndex = 0; squareIndex < sender.Squares().length; squareIndex++) {
			for (var cellIndex = 0; cellIndex < sender.Squares()[squareIndex].Cells().length; cellIndex++) {
				if(data.ColIndex() == sender.Squares()[squareIndex].Cells()[cellIndex].ColIndex() && 
					data.RowIndex() == sender.Squares()[squareIndex].Cells()[cellIndex].RowIndex()) {
					evt.stopImmediatePropagation();
					sender.SetCellValue(squareIndex, cellIndex, value);
					return;
				}
			};
		};
	};

	this.RequestSave = function() {
		sender.NeedsSave(true);
	};
};

var SquareViewModel = function() {
	this.Cells = ko.observableArray();
};

var CellViewModel = function() {
	this.SolutionValue = ko.observable();
	this.OriginalValue = ko.observable();
	this.RowIndex = ko.observable();
	this.ColIndex = ko.observable();
	this.CurrentValue = ko.observable();
	this.IsSelected = ko.observable(false);
	this.IsValid = ko.observable(false);

	this.WasSelectedWithMouse = ko.observable(false);

	this.IsEditable = ko.computed(function() {
		return !this.OriginalValue();
	}, this);

	this.DisplayInputPad = ko.computed(function() {
		return this.WasSelectedWithMouse() && this.IsEditable();
	}, this);

	this.IsFilled = ko.computed(function() {
        return this.CurrentValue() != "";
    }, this);

	this.MarkAsInvalid = ko.computed(function() {
        return this.IsFilled() && this.IsEditable() && !this.IsValid();
    }, this);
};