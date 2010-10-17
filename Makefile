.PHONY: test-all

TEST_FILES=`find test -name '*.js'`

test-all:
	@@for FILE in $(TEST_FILES); do node $$FILE ; done
